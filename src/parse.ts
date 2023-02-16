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
 * Parse line
 * @param line Line
 */
const parseLine = (line: string): void => {
  if (!line) return

  line = line.trim()

  // Comments
  if (inComment) {
    if (line.includes('*/')) {
      const pos = line.indexOf('*/')
      const begin = line.slice(0, pos)
      const end = line.slice(pos)

      currentNode.value += begin
      currentNode = currentNode.parent

      parseLine(end)
    } else {
      currentNode.value += line
    }
  }

  if (line.includes('/*')) {
    const pos = line.indexOf('/*')
    const begin = line.slice(0, pos)
    const end = line.slice(pos)

    parseLine(begin)

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

    return
  }

  if (line.includes('//')) {
    const pos = line.indexOf('//')
    const begin = line.slice(0, pos)
    const end = line.slice(pos)

    parseLine(begin)

    currentNode.children = [
      ...(currentNode.children || []),
      {
        family: 'comment',
        type: 'inline',
        value: end,
        parent: currentNode
      }
    ]

    return
  }

  // String
  if (inEJS && line.includes("'")) {
    const pos = line.indexOf("'")
    const begin = line.slice(0, pos)
    const end = line.slice(pos + 1)

    parseLine(begin)

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

    parseLine(end2)

    return
  }

  // Blocks
  for (const block of blocks) {
    if (line.includes(block.identifier)) {
      const pos = line.indexOf(block.identifier)
      const begin = line.slice(0, pos)
      const end = line.slice(pos + block.identifier.length)

      parseLine(begin)

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
            lineBreak: block.lineBreak,
            parent: currentNode
          }
        ]
        currentNode = currentNode.children[currentNode.children.length - 1]
      } else {
        currentNode.end = block.identifier
        currentNode = currentNode.parent ?? tree
      }

      parseLine(end)

      return
    }
  }

  // Operators
  for (const operator of operators) {
    if (line.includes(operator.identifier)) {
      const pos = line.indexOf(operator.identifier)
      const begin = line.slice(0, pos)
      const end = line.slice(pos + operator.identifier.length)

      parseLine(begin)

      currentNode.children = [
        ...(currentNode.children || []),
        {
          family: 'operators',
          type: operator.type,
          value: operator.identifier,
          parent: currentNode
        }
      ]

      parseLine(end)

      return
    }
  }

  // Rest
  const values = line.split(' ')
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

/**
 * Parse
 * @param text Text
 * @returns Tree
 */
export const parse = (text: string): Tree => {
  const lines = text.split('\n')

  lines.forEach((line) => {
    parseLine(line)
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
