import {
  blocks,
  Def,
  inlineComment,
  lineBreak,
  multilineComment,
  operators,
  root,
  space,
  string
} from './defs.js'

/**
 * Node interface
 */
export interface Node extends Def {
  value: string
  end?: Node
  children?: Node[]
  left?: Node
  right?: Node
  parent: Node
}

/**
 * Tree interface
 */
export interface Tree extends Node {}

// Tree
const tree: Tree = {
  ...root,
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
    if (text.includes(multilineComment[1].identifier)) {
      const pos = text.indexOf(multilineComment[1].identifier)
      const begin = text.slice(0, pos)
      const end = text.slice(pos + multilineComment[1].identifier.length)

      currentNode.children = [
        ...(currentNode.children || []),
        {
          ...string,
          value: begin,
          parent: currentNode
        },
        {
          ...multilineComment[1],
          value: multilineComment[1].identifier,
          parent: currentNode
        }
      ]
      currentNode = currentNode.parent

      inComment = false

      parseLoop(end)

      return true
    } else {
      currentNode.children = [
        ...(currentNode.children || []),
        {
          ...string,
          value: text,
          parent: currentNode
        }
      ]

      return true
    }
  }

  // Multiline comment
  if (text.includes(multilineComment[0].identifier)) {
    const pos = text.indexOf(multilineComment[0].identifier)
    const begin = text.slice(0, pos)
    const end = text.slice(pos + multilineComment[0].identifier.length)

    parseLoop(begin)

    currentNode.children = [
      ...(currentNode.children || []),
      {
        ...multilineComment[0],
        value: multilineComment[0].identifier,
        parent: currentNode
      }
    ]

    currentNode = currentNode.children[currentNode.children.length - 1]
    currentNode.children = [
      {
        ...string,
        value: end,
        parent: currentNode
      }
    ]
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
        ...inlineComment,
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
        ...string,
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
            ...block,
            value: block.identifier,
            parent: currentNode
          }
        ]

        currentNode = currentNode.children[currentNode.children.length - 1]
      } else {
        currentNode.children = [
          ...(currentNode.children || []),
          {
            ...block,
            value: block.identifier,
            parent: currentNode.parent
          }
        ]
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
          ...operator,
          value: operator.identifier,
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
          ...string,
          value,
          parent: currentNode
        })

      if (i < values.length - 1)
        children.push({
          ...space,
          value: space.identifier,
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
  // Split
  const lines = text.split('\n')

  // Loop over lines
  lines.forEach((line) => {
    parseLoop(line)
    currentNode.children = [
      ...(currentNode.children || []),
      {
        ...lineBreak,
        value: lineBreak.identifier,
        parent: currentNode
      }
    ]
  })

  return tree
}
