import { Def } from '../defs/typedef.d.js'
import { Tree, Node, NodeRef } from './typedef.js'

import {
  blocks,
  inlineComment,
  keywords,
  lineBreak,
  multilineComment,
  operators,
  root,
  string,
  types
} from '../defs/index.js'

// TODO treat [] as ?

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
  node.children = [...(node.children || []), newChild]

  return newChild
}

/**
 * Parse inline comment
 * @param text Text
 */
const parseInlineComment = (text: string): void => {
  const pos = text.indexOf('//')
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
 */
const parseMultlineCommentClose = (text: string): void => {
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

  parseLoop(end)
}

/**
 * Parse comment
 * @param text Text
 * @returns Parsed?
 */
const parseComment = (text: string): boolean => {
  // Inline comment
  if (text.includes('//')) {
    parseInlineComment(text)
    return true
  }

  // Multiline comments
  const open = multilineComment[0].identifier
  const close = multilineComment[1].identifier
  if (inMultilineComment) {
    if (text.includes(close)) {
      parseMultlineCommentClose(text)
      return true
    } else {
      appendChild(currentNode, {
        ...string,
        value: text
      })
      return true
    }
  } else {
    // Multiline comment
    if (text.includes(open)) {
      parseMultlineCommentOpen(text)
      return true
    }
  }

  return false
}

/**
 * Parse string
 * @param text Text
 * @returns Parsed?
 */
const parseString = (text: string): boolean => {
  // Do not consider ' as an operator in EJS
  if (inEJS && text.includes("'")) {
    let pos = text.indexOf("'")
    const begin = text.slice(0, pos)
    const inString = text.slice(pos + 1)

    parseLoop(begin)

    pos = inString.indexOf("'")
    const stringContent = inString.slice(0, pos)
    const end = inString.slice(pos + 1)

    appendChild(currentNode, {
      ...string,
      value: "'" + stringContent + "'"
    })

    parseLoop(end)

    return true
  }

  if (text.includes('"')) {
    let pos = text.indexOf('"')
    const begin = text.slice(0, pos)
    const inString = text.slice(pos + 1)

    parseLoop(begin, inString)

    pos = inString.indexOf('"')
    const stringContent = inString.slice(0, pos)
    const end = inString.slice(pos + 1)

    appendChild(currentNode, {
      ...string,
      value: '"' + stringContent + '"'
    })

    parseLoop(end)

    return true
  }

  return false
}

/**
 * Parse type
 * @param text Text
 * @returns Parsed?
 */
const parseType = (text: string): boolean => {
  const words = text.split(' ')
  for (const type of types) {
    if (words.includes(type.identifier)) {
      const index = words.indexOf(type.identifier)
      const begin = words.slice(0, index).join(' ')
      const end = words.slice(index + 1).join(' ')

      parseLoop(begin, end)

      appendChild(currentNode, {
        ...type,
        value: type.identifier
      })

      parseLoop(end)

      return true
    }
  }

  return false
}

/**
 * Parse keyword
 * @param text Text
 * @returns Parsed?
 */
const parseKeyword = (text: string): boolean => {
  const words = text.split(' ')
  for (const keyword of keywords) {
    if (words.includes(keyword.identifier)) {
      const index = words.indexOf(keyword.identifier)
      const begin = words.slice(0, index).join(' ')
      const end = words.slice(index + 1).join(' ')

      parseLoop(begin, end)

      appendChild(currentNode, {
        ...keyword,
        value: keyword.identifier
      })

      parseLoop(end)

      return true
    }
  }

  return false
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
const parseBlockOpen = (block: Def, text: string, next?: string): void => {
  // Check inline
  let inline = false
  let opens = getIndices(text, block.identifier)
  let closes: number[] = []
  block.closeIdentifiers?.forEach((closeIdentifier) => {
    const localCloses = getIndices(text, closeIdentifier)
    const nextCloses = next ? getIndices(next, closeIdentifier) : []
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
 * Index of min
 * @param array Array
 * @param except Except
 * @returns Index
 */
const indexOfMin = (array: number[]): number => {
  if (array.length === 0) return -1

  let min = array[0]
  let minIndex = 0

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
 * Parse block
 * @param text Text
 * @param next Next
 * @returns Parsed?
 */
const parseBlock = (text: string, next?: string): boolean => {
  // Find first block identifier
  let ok = false
  const positions = blocks.map((block) => {
    const pos = text.indexOf(block.identifier)
    if (pos === -1) {
      return Number.MAX_SAFE_INTEGER
    } else {
      ok = true
      return pos
    }
  })

  if (!ok) return false

  // Parse
  const first = indexOfMin(positions)
  const block = blocks[first]

  const pos = positions[first]
  const begin = text.slice(0, pos)
  const end = text.slice(pos + block.identifier.length)

  parseLoop(begin)

  if (block.enableEJS) inEJS = true
  if (block.disableEJS) inEJS = false

  if (block.dir === 1) {
    parseBlockOpen(block, end, next)
  } else {
    parseBlockClose(block)
  }

  parseLoop(end)

  return true
}

/**
 * Parse operators
 * @param text Text
 * @returns Parsed?
 */
const parseOperator = (text: string): boolean => {
  // Find first operator identifier
  let ok = false
  const positions = operators.map((operator) => {
    // Skip?
    const params = inEJS ? operator.ejs : operator.freefem
    if (params?.skip) return Number.MAX_SAFE_INTEGER

    const pos = text.indexOf(operator.identifier)
    if (pos === -1) {
      return Number.MAX_SAFE_INTEGER
    } else {
      ok = true
      return pos
    }
  })

  if (!ok) return false

  // Parse
  const first = indexOfMin(positions)
  const operator = operators[first]

  const pos = text.indexOf(operator.identifier)
  const begin = text.slice(0, pos)
  const end = text.slice(pos + operator.identifier.length)

  parseLoop(begin)

  appendChild(currentNode, { ...operator, value: operator.identifier })

  parseLoop(end)

  return true
}

/**
 * Parse loop
 * @param text Text
 * @param next Next
 */
const parseLoop = (text: string, next?: string): void => {
  if (!text) return

  text = text.trim()

  if (
    !parseComment(text) && // Comments
    !parseString(text) && // String
    !parseType(text) && // Types
    !parseKeyword(text) && // Keyword
    !parseBlock(text, next) && // Blocks
    !parseOperator(text) // Operators
  ) {
    // Rest
    const values = text.split(' ')

    for (const value of values) {
      if (value)
        appendChild(currentNode, {
          ...string,
          value
        })
    }
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
