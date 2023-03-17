import { NodeLR, TreeLR } from './typedef.js'

import { space } from '../defs/index.js'
import { appendRight, removeLeft, removeSelf } from './tools.js'

// Indent length
const indentLength = 4

// In EJS?
let inEJS = false

// Current depth
let currentDepth = 0

// Current EJS depth
let currentEJSDepth = 0

/**
 * Set indent
 * @param node Node
 */
const setIndent = (node: NodeLR): void => {
  const numberOfSpaces = (inEJS ? currentEJSDepth : currentDepth) * indentLength

  // Indents
  const indents: NodeLR[] = []
  for (let i = 0; i < numberOfSpaces; ++i) {
    const indent = {
      ...space,
      name: 'indent',
      value: space.identifier,
      parent: node.parent
    }
    indents.push(indent)
  }

  // Append
  for (let i = 0; i < numberOfSpaces; ++i) appendRight(node, indents[i])
}

/**
 * Eat indent
 * @param node Node
 */
const eatIndent = (node: NodeLR): void => {
  const numberOfSpaces = indentLength

  // Check
  let ok = true
  let left = node.left?.deref()
  if (left?.family === 'block') {
    // Check if last children are indent
    const children = left.children
    if (!children) ok = false
    else {
      const length = children.length
      for (let i = 0; i < numberOfSpaces; ++i) {
        if (children[length - 1 - i]?.name !== 'indent') {
          ok = false
          break
        }
      }

      if (ok)
        for (let i = 0; i < numberOfSpaces; ++i)
          removeSelf(children[length - 1 - i])
    }
  } else {
    // Check if lefts are indent
    for (let i = 0; i < numberOfSpaces; ++i) {
      if (left?.name !== 'indent') {
        ok = false
        break
      }
      left = left.left?.deref()
    }

    if (ok) for (let i = 0; i < numberOfSpaces; ++i) removeLeft(node)
  }
}

/**
 * Eat all indent
 * @param node Node
 */
const eatAllIndent = (node: NodeLR): void => {
  const indent = inEJS ? currentEJSDepth : currentDepth
  for (let i = 0; i < indent; ++i) eatIndent(node)
}

/**
 * Check EJS
 * @param node Node
 */
const checkEJS = (node: NodeLR): void => {
  if (node.enableEJS) {
    eatAllIndent(node)
    inEJS = true
    increaseDepth(node)
  } else if (node.disableEJS) {
    increaseDepth(node)
    inEJS = false
  } else {
    increaseDepth(node)
  }
}

/**
 * Increase depth
 * @param node Node
 */
const increaseDepth = (node: NodeLR) => {
  const dir = node.dir
  if (!dir) return

  if (inEJS) currentEJSDepth += dir
  else currentDepth += dir

  if (dir < 0) eatIndent(node)
}

/**
 * Set current indent
 * @param node Node
 */
const setCurrentIndent = (node: NodeLR): void => {
  // Remove double line break
  const right = node.right?.deref()
  const rightRight = right?.right?.deref()
  if (
    node.name === 'lineBreak' &&
    right?.name === 'lineBreak' &&
    rightRight?.name === 'lineBreak'
  ) {
    removeSelf(node)
    return
  }

  // Indent
  if (node.name === 'lineBreak') setIndent(node)
}

export const indent = (tree: TreeLR): void => {
  if (!tree.children) return

  for (const child of tree.children) {
    checkEJS(child)
    setCurrentIndent(child)
    indent(child)
  }
}