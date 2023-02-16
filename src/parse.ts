import { blocks, operators } from './defs.js'

/**
 * Node interface
 */
export interface Node {
  family?: string
  type: string
  value: string
  start?: string
  end?: string
  spaceBefore?: boolean
  lineBreak?: boolean
  children?: Node[]
  parent: Node
}

/**
 * Tree interface
 */
export interface Tree extends Node {}

// Tree
const tree: Tree = {
  type: 'root',
  value: '',
  parent: null
}

// Current node
let currentNode = tree

// In comment?
let inComment = false

// In EJS?
let inEJS = false

/**
 * Parse comment
 * @param text Text
 * @returns Parsed?
 */
const parseComment = (text: string): boolean => {
  // Comments
  if (inComment) {
    if (text.includes('*/')) {
      const pos = text.indexOf('*/')
      const begin = text.slice(0, pos)
      const end = text.slice(pos)

      currentNode.value += begin
      currentNode = currentNode.parent

      parseLoop(end)

      return true
    } else {
      currentNode.value += text

      return true
    }
  }

  // Multiline comment
  if (text.includes('/*')) {
    const pos = text.indexOf('/*')
    const begin = text.slice(0, pos)
    const end = text.slice(pos)

    parseLoop(begin)

    currentNode.children = [
      ...(currentNode.children || []),
      {
        family: 'comment',
        type: 'multiline',
        value: end,
        parent: currentNode
      }
    ]

    currentNode = currentNode.children[currentNode.children.length - 1]
    inComment = true

    return true
  }

  // Inline comment
  if (text.includes('//')) {
    const pos = text.indexOf('//')
    const begin = text.slice(0, pos)
    const end = text.slice(pos)

    parseLoop(begin)

    currentNode.children = [
      ...(currentNode.children || []),
      {
        family: 'comment',
        type: 'inline',
        value: end,
        parent: currentNode
      }
    ]

    return true
  }

  return false
}

/**
 * Parse string
 * @param text Text
 * @returns Parsed?
 */
const parseString = (text: string): boolean => {
  if (inEJS && text.includes("'")) {
    const pos = text.indexOf("'")
    const begin = text.slice(0, pos)
    const end = text.slice(pos + 1)

    parseLoop(begin)

    const pos2 = end.indexOf("'")
    const begin2 = end.slice(0, pos2)
    const end2 = end.slice(pos2 + 1)

    currentNode.children = [
      ...(currentNode.children || []),
      {
        type: 'string',
        value: "'" + begin2 + "'",
        parent: currentNode
      }
    ]

    parseLoop(end2)

    return true
  }

  return false
}

/**
 * Parse block
 * @param text Text
 * @returns Parsed?
 */
const parseBlocks = (text: string): boolean => {
  for (const block of blocks) {
    if (text.includes(block.identifier)) {
      const pos = text.indexOf(block.identifier)
      const begin = text.slice(0, pos)
      const end = text.slice(pos + block.identifier.length)

      parseLoop(begin)

      if (block.enableEJS) inEJS = true
      if (block.disableEJS) inEJS = false

      if (block.dir === 1) {
        currentNode.children = [
          ...(currentNode.children || []),
          {
            family: 'blocks',
            type: block.type,
            value: '',
            start: block.identifier,
            spaceBefore: block.spaceBefore,
            lineBreak: block.lineBreak,
            parent: currentNode
          }
        ]
        currentNode = currentNode.children[currentNode.children.length - 1]
      } else {
        currentNode.end = block.identifier
        currentNode = currentNode.parent ?? tree
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
const parseOperators = (text: string): boolean => {
  for (const operator of operators) {
    if (text.includes(operator.identifier)) {
      const pos = text.indexOf(operator.identifier)
      const begin = text.slice(0, pos)
      const end = text.slice(pos + operator.identifier.length)

      parseLoop(begin)

      currentNode.children = [
        ...(currentNode.children || []),
        {
          family: 'operators',
          type: operator.type,
          value: operator.identifier,
          spaceBefore: operator.spaceBefore,
          lineBreak: operator.lineBreak,
          parent: currentNode
        }
      ]

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
    !parseString(text) && // String
    !parseBlocks(text) && // Blocks
    !parseOperators(text) // Operators
  ) {
    // Rest
    const values = text.split(' ')
    const children = []

    for (let i = 0; i < values.length; ++i) {
      const value = values[i]
      if (value)
        children.push({
          type: 'text',
          value,
          parent: currentNode
        })

      if (i < values.length - 1)
        children.push({
          type: 'space',
          value: '',
          parent: currentNode
        })
    }

    currentNode.children = [...(currentNode.children || []), ...children]
  }
}

/**
 * Parse
 * @param text Text
 * @returns Tree
 */
export const parse = (text: string): Tree => {
  const lines = text.split('\n')

  lines.forEach((line) => {
    parseLoop(line)
    currentNode.children = [
      ...(currentNode.children || []),
      {
        type: 'line_break',
        value: '',
        parent: currentNode
      }
    ]
  })

  return tree
}
