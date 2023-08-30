/** @module Src.Parse */

import { Def } from '../defs/typedef.d.js'
import { Tree, Node, NodeRef } from './typedef.js'

import {
  blocks,
  customs,
  inlineComment,
  keywords,
  lineBreak,
  multilineComment,
  operators,
  root,
  string,
  types
} from '../defs/index.js'

/**
 * Set reference
 * @param node Node
 * @returns Ref
 */
const setRef = (node?: Node): NodeRef | undefined => {
  return node ? new WeakRef(node) : undefined
}

// Tree
const tree = {
  ...root,
  value: ''
} as Tree

// Current node
let currentNode = tree as Node

// In multline comment?
let inMultilineComment = false

// In EJS?
let inEJS = false

/**
 * Append child
 * @param node Node
 * @param child Child
 * @returns New node
 */
const appendChild = (node: Node, child: Omit<Node, 'parent'>): Node => {
  const newChild = {
    ...child,
    parent: setRef(node)!
  }
  node.children = [...(node.children ?? []), newChild]

  return newChild
}

/**
 * Index of min
 * @param array Array
 * @param except Except
 * @returns Index
 */
const indexOfMin = (array: number[]): number => {
  if (array.length === 0) return -1

  let min = Number.MAX_SAFE_INTEGER
  let minIndex = -1

  for (let i = 0; i < array.length; ++i) {
    const localMin = array[i]
    if (localMin < min) {
      minIndex = i
      min = localMin
    }
  }

  return minIndex
}

/**
 * Index and position of min
 * @param array Array
 * @returns { index, pos }
 */
const indexAndPosOfMin = (array: number[]): { index: number; pos: number } => {
  if (array.length === 0) return { index: -1, pos: -1 }

  let min = Number.MAX_SAFE_INTEGER
  let minIndex = -1

  for (let i = 0; i < array.length; ++i) {
    const localMin = array[i]
    if (localMin < min) {
      minIndex = i
      min = localMin
    }
  }

  return { index: minIndex, pos: min }
}

/**
 * Find first in words
 * @param text Text
 * @param defs Defs
 * @returns Index
 */
const findFirstInWords = (text: string, defs: Def[]): number => {
  const words = text.split(' ')

  let ok = false
  const positions = defs.map((def) => {
    // Skip?
    const params = inEJS ? def.ejs : def.freefem
    if (params?.skip) return Number.MAX_SAFE_INTEGER

    const pos = words.indexOf(def.identifier)
    if (pos === -1) {
      return Number.MAX_SAFE_INTEGER
    } else {
      ok = true
      return pos
    }
  })

  if (!ok) return -1

  // Parse
  return indexOfMin(positions)
}

/**
 * Find first in text
 * @param text Text
 * @param defs Defs
 * @returns { index, pos }
 */
const findFirstInText = (
  text: string,
  defs: Def[]
): { index: number; pos: number } => {
  let ok = false
  const positions = defs.map((def) => {
    // Skip?
    const params = inEJS ? def.ejs : def.freefem
    if (params?.skip) return Number.MAX_SAFE_INTEGER

    const pos = text.indexOf(def.identifier)
    if (pos === -1) {
      return Number.MAX_SAFE_INTEGER
    } else {
      ok = true
      return pos
    }
  })

  if (!ok) return { index: -1, pos: -1 }

  // Parse
  return indexAndPosOfMin(positions)
}

/**
 * Parse inline comment
 * @param text Text
 */
const parseInlineComment = (text: string): void => {
  const pos = text.indexOf(inlineComment.identifier)
  const begin = text.slice(0, pos)
  const end = text.slice(pos)

  parseLoop(begin)

  appendChild(currentNode, { ...inlineComment, value: end })
}

/**
 * Parse multline comment open
 * @param text Text
 */
const parseMultlineCommentOpen = (text: string): void => {
  const openBlock = multilineComment[0]
  const open = openBlock.identifier

  const pos = text.indexOf(open)
  const begin = text.slice(0, pos)
  const end = text.slice(pos + open.length)

  parseLoop(begin)

  // Append multiline block
  const newNode = appendChild(currentNode, {
    ...openBlock,
    value: open
  })

  // Go in multiline comment block
  currentNode = newNode
  inMultilineComment = true

  // Append current text
  appendChild(currentNode, {
    ...string,
    value: end
  })
}

/**
 * Parse multline comment close
 * @param text Text
 * @param next Next
 */
const parseMultlineCommentClose = (text: string, ...next: string[]): void => {
  const closeBlock = multilineComment[1]
  const close = closeBlock.identifier

  const pos = text.indexOf(close)
  const begin = text.slice(0, pos)
  const end = text.slice(pos + close.length)

  // Append text
  appendChild(currentNode, {
    ...string,
    value: begin
  })
  // Append end
  appendChild(currentNode, {
    ...closeBlock,
    value: close
  })

  // Get out of multiline comment block
  currentNode = currentNode.parent.deref()!
  inMultilineComment = false

  parseLoop(end, ...next)
}

/**
 * Parse comment
 * @param text Text
 * @param next Next
 * @returns Parsed?
 */
const parseComment = (text: string, ...next: string[]): boolean => {
  // Inline comment
  if (text.includes(inlineComment.identifier)) {
    parseInlineComment(text)
    return true
  }

  // Multiline comments
  const open = multilineComment[0].identifier
  const close = multilineComment[1].identifier
  if (inMultilineComment) {
    if (text.includes(close)) {
      parseMultlineCommentClose(text, ...next)
      return true
    } else {
      appendChild(currentNode, {
        ...string,
        value: text
      })
      return true
    }
  } else if (text.includes(open)) {
    // Multiline comment
    parseMultlineCommentOpen(text)
    return true
  }

  return false
}

/**
 * Parse number
 * @param text Text
 * @param next Next
 * @returns Parsed?
 */
const parseNumber = (text: string, ...next: string[]): boolean => {
  let found = /[\d+.?]+e-[\d+.?]+/.exec(text)
  if (found) {
    const num = found[0]
    const pos = text.indexOf(num)
    const begin = text.slice(0, pos)
    const end = text.slice(pos + num.length)

    parseLoop(begin, end, ...next)

    appendChild(currentNode, {
      ...string,
      value: found[0]
    })

    parseLoop(end, ...next)

    return true
  }

  return false
}

/**
 * Process single quote string
 * @param text Text
 * @param next Next
 * @returns Parsed?
 */
const processSingleQuoteString = (text: string, ...next: string[]): boolean => {
  let pos = text.indexOf("'")
  const begin = text.slice(0, pos)
  const inString = text.slice(pos + 1)

  // check correct close
  const ejsClosePos = text.indexOf('%>')

  pos = inString.indexOf("'")
  if (pos === -1 || (ejsClosePos !== -1 && ejsClosePos < pos)) return false
  const stringContent = inString.slice(0, pos)
  const end = inString.slice(pos + 1)

  parseLoop(begin, inString, ...next)

  appendChild(currentNode, {
    ...string,
    value: "'" + stringContent + "'"
  })

  parseLoop(end, ...next)

  return true
}

/**
 * Process double quote string
 * @param text Text
 * @param next Next
 * @returns Parsed?
 */
const processDoubleQuoteString = (text: string, ...next: string[]): boolean => {
  let pos = text.indexOf('"')
  const begin = text.slice(0, pos)
  const inString = text.slice(pos + 1)

  parseLoop(begin, inString, ...next)

  pos = inString.indexOf('"')
  // Check \" in string
  let pos2 = 1
  while (pos2 !== -1) {
    pos2 = inString.indexOf('\\"', pos - 1)
    if (pos2 === -1) break

    if (pos2 === pos - 1) pos = inString.indexOf('"', pos + 1)
    else pos2 = -1
  }
  const stringContent = inString.slice(0, pos)
  const end = inString.slice(pos + 1)

  appendChild(currentNode, {
    ...string,
    value: '"' + stringContent + '"'
  })

  parseLoop(end, ...next)

  return true
}

/**
 * Parse string
 * @param text Text
 * @param next Next
 * @returns Parsed?
 */
const parseString = (text: string, ...next: string[]): boolean => {
  // Do not consider ' as an operator in EJS
  if (inEJS && text.includes("'")) {
    return processSingleQuoteString(text, ...next)
  }

  if (text.includes('"')) {
    return processDoubleQuoteString(text, ...next)
  }

  return false
}

/**
 * Parse type
 * @param text Text
 * @param next Next
 * @returns Parsed?
 */
const parseType = (text: string, ...next: string[]): boolean => {
  const words = text.split(' ')

  // Find first type identifier
  const first = findFirstInWords(text, types)
  if (first === -1) return false

  // Parse
  const type = types[first]

  const index = words.indexOf(type.identifier)
  const begin = words.slice(0, index).join(' ')
  const end = words.slice(index + 1).join(' ')

  parseLoop(begin, end, ...next)

  appendChild(currentNode, {
    ...type,
    value: type.identifier
  })

  parseLoop(end, ...next)

  return true
}

/**
 * Parse keyword
 * @param text Text
 * @param next Next
 * @returns Parsed?
 */
const parseKeyword = (text: string, ...next: string[]): boolean => {
  const words = text.split(' ')

  // Find first keyword identifier
  const first = findFirstInWords(text, keywords)
  if (first === -1) return false

  // Parse
  const keyword = keywords[first]

  const index = words.indexOf(keyword.identifier)
  const begin = words.slice(0, index).join(' ')
  const end = words.slice(index + 1).join(' ')

  parseLoop(begin, end, ...next)

  appendChild(currentNode, {
    ...keyword,
    value: keyword.identifier
  })

  parseLoop(end, ...next)

  return true
}

/**
 * Parse custom
 * @param text Text
 * @param next Next
 * @returns Parsed?
 */
const parseCustom = (text: string, ...next: string[]): boolean => {
  // Find first custom identifier
  const first = findFirstInText(text, customs)
  if (first.index === -1) return false

  // Parse
  const custom = customs[first.index]

  const pos = first.pos
  const begin = text.slice(0, pos)
  const end = text.slice(pos + custom.identifier.length)

  parseLoop(begin, end, ...next)

  appendChild(currentNode, {
    ...custom,
    value: custom.identifier
  })

  parseLoop(end, ...next)

  return true
}

/**
 * Get indices
 * @param text Text
 * @param separator Separator
 * @returns Indices
 */
const getIndices = (text: string, separator: string): number[] => {
  const indices = []

  let currentPos = 0
  let currentText = text
  let pos = text.indexOf(separator)
  while (pos !== -1) {
    indices.push(currentPos + pos)
    currentPos += pos + separator.length
    currentText = currentText.slice(pos + separator.length)
    pos = currentText.indexOf(separator)
  }

  return indices
}

/**
 * Parse block open
 * @param block Block def
 * @param text Text
 * @param next Next
 */
const parseBlockOpen = (block: Def, text: string, ...next: string[]): void => {
  // Check inline
  let inline = false
  let opens = getIndices(text, block.identifier)
  let closes: number[] = []
  block.closeIdentifiers?.forEach((closeIdentifier) => {
    const localCloses = getIndices(text, closeIdentifier)
    const nextCloses = next?.map((n) => getIndices(n, closeIdentifier)).flat()
    closes = [...localCloses, ...nextCloses]
  })
  closes.sort((a, b) => a - b)

  for (const close of closes) {
    if (!opens[0] || close < opens[0]) {
      inline = true
      break
    } else {
      opens = opens.slice(1)
      closes = closes.slice(1)
    }
  }

  // Append block
  const newNode = appendChild(currentNode, {
    ...block,
    value: block.identifier,
    isInline: inline
  })

  // Go in block
  currentNode = newNode
}

/**
 * Parse block close
 * @param block Block def
 */
const parseBlockClose = (block: Def): void => {
  // Append end
  appendChild(currentNode, { ...block, value: block.identifier })
  // Get out of block
  currentNode = currentNode.parent.deref()!
}

/**
 * Parse block
 * @param text Text
 * @param next Next
 * @returns Parsed?
 */
const parseBlock = (text: string, ...next: string[]): boolean => {
  // Find first block identifier
  const first = findFirstInText(text, blocks)
  if (first.index === -1) return false

  // Parse
  const block = blocks[first.index]

  const pos = first.pos
  const begin = text.slice(0, pos)
  const end = text.slice(pos + block.identifier.length)

  parseLoop(begin, ...next)

  if (block.enableEJS) inEJS = true
  if (block.disableEJS) inEJS = false

  if (block.dir === 1) {
    parseBlockOpen(block, end, ...next)
  } else {
    parseBlockClose(block)
  }

  parseLoop(end, ...next)

  return true
}

/**
 * Parse operators
 * @param text Text
 * @param next Next
 * @returns Parsed?
 */
const parseOperator = (text: string, ...next: string[]): boolean => {
  // Find first operator identifier
  const first = findFirstInText(text, operators)
  if (first.index === -1) return false

  // Parse
  const operator = operators[first.index]

  const pos = first.pos
  const begin = text.slice(0, pos)
  const end = text.slice(pos + operator.identifier.length)

  parseLoop(begin, end, ...next)

  appendChild(currentNode, { ...operator, value: operator.identifier })

  parseLoop(end, ...next)

  return true
}

const getMin = (text: string): { index: number; pos: number } => {
  const positions = []
  // Comments (0&1)
  positions.push(findFirstInText(text, [inlineComment]))
  positions.push(findFirstInText(text, multilineComment))
  // String (2)
  if (inEJS && text.includes("'")) {
    const pos = text.indexOf("'")
    positions.push({ index: -1, pos })
  } else if (text.includes('"')) {
    const pos = text.indexOf('"')
    positions.push({ index: -1, pos })
  } else {
    positions.push({ index: -1, pos: -1 })
  }
  // Number (3)
  const found = /[\d+.?]+e-[\d+.?]+/.exec(text)
  if (found) {
    const num = found[0]
    const pos = text.indexOf(num)
    positions.push({ index: -1, pos })
  } else {
    positions.push({ index: -1, pos: -1 })
  }
  // Types (4)
  positions.push({ index: -1, pos: findFirstInWords(text, types) })
  // Keywords (5)
  positions.push({ index: -1, pos: findFirstInWords(text, keywords) })
  // Customs (6)
  positions.push(findFirstInText(text, customs))
  // Blocks (7)
  positions.push(findFirstInText(text, blocks))
  // Operators (8)
  positions.push(findFirstInText(text, operators))

  const min: { index: number; pos: number } = {
    index: -1,
    pos: Number.MAX_SAFE_INTEGER
  }
  positions.forEach((position, index) => {
    if (position.pos !== -1 && position.pos < min.pos) {
      min.pos = position.pos
      min.index = index
    }
  })

  return min
}

/**
 * Parse loop
 * @param text Text
 * @param next Next
 */
const parseLoop = (text: string, ...next: string[]): void => {
  if (!text) return

  text = text.trim()

  // Find first occurence
  const min = getMin(text)

  switch (min.index) {
    case 0:
    case 1:
      parseComment(text, ...next)
      break
    case 2:
      parseString(text, ...next)
      break
    case 3:
      parseNumber(text, ...next)
      break
    case 4:
      parseType(text, ...next)
      break
    case 5:
      parseKeyword(text, ...next)
      break
    case 6:
      parseCustom(text, ...next)
      break
    case 7:
      parseBlock(text, ...next)
      break
    case 8:
      parseOperator(text, ...next)
      break
    default:
      // Rest
      const values = text.split(' ')

      for (const value of values) {
        if (value)
          appendChild(currentNode, {
            ...string,
            value
          })
      }
      break
  }
}

/**
 * Parse
 * @param text Text
 * @returns Tree
 */
export const parse = (text: string): Tree => {
  // Split
  const lines = text.split('\n')

  // Loop over lines
  lines.forEach((line) => {
    parseLoop(line)
    appendChild(currentNode, {
      ...lineBreak,
      value: lineBreak.identifier
    })
  })

  return tree
}
