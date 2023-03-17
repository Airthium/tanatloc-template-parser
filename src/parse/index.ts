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
 * Parse EJS string
 * @param text Text
 * @returns Parsed?
 */
const parseEJSString = (text: string): boolean => {
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

      parseLoop(begin)

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

      parseLoop(begin)

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
 * Parse block open
 * @param block Block def
 * @param text Text
 */
const parseBlockOpen = (block: Def, text: string): void => {
  // Check inline
  let inline = false
  let openPos = text.indexOf(block.identifier)
  if (openPos === -1) openPos = text.length
  let closePos = text.length
  block.closeIdentifiers?.forEach((closeIdentifier) => {
    const currentClosePos = text.indexOf(closeIdentifier)
    if (currentClosePos !== -1) closePos = Math.min(closePos, currentClosePos)
  })
  if (closePos < openPos) inline = true

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
 * @returns Parsed?
 */
const parseBlock = (text: string): boolean => {
  for (const block of blocks) {
    if (text.includes(block.identifier)) {
      const pos = text.indexOf(block.identifier)
      const begin = text.slice(0, pos)
      const end = text.slice(pos + block.identifier.length)

      parseLoop(begin)

      if (block.enableEJS) inEJS = true
      if (block.disableEJS) inEJS = false

      if (block.dir === 1) {
        parseBlockOpen(block, end)
      } else {
        parseBlockClose(block)
      }

      parseLoop(end)

      return true
    }
  }

  return false
}

/**
 * Parse operators
 * @param text Text
 * @returns Parsed?
 */
const parseOperator = (text: string): boolean => {
  for (const operator of operators) {
    if (text.includes(operator.identifier)) {
      const pos = text.indexOf(operator.identifier)
      const begin = text.slice(0, pos)
      const end = text.slice(pos + operator.identifier.length)

      parseLoop(begin)

      appendChild(currentNode, { ...operator, value: operator.identifier })

      parseLoop(end)

      return true
    }
  }

  return false
}

/**
 * Parse loop
 * @param text Text
 */
const parseLoop = (text: string): void => {
  if (!text) return

  text = text.trim()

  if (
    !parseComment(text) && // Comments
    !parseEJSString(text) && // String
    !parseType(text) && // Types
    !parseKeyword(text) && // Keyword
    !parseBlock(text) && // Blocks
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
