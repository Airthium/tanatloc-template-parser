import { Tree } from '../parse/typedef.js'
import { NodeLR } from './typedef.js'

import { multilineComment } from '../defs/index.js'
import {
  eatIndent,
  eatAllIndent,
  removeSelf,
  setIndent,
  setLeftAndRight
} from './tools.js'
import { setSpaceBefore } from './setSpaceBefore.js'
import { setSpaceAfter } from './setSpaceAfter.js'
import { setLineBreakBefore } from './setLineBreakBefore.js'
import { setLineBreakAfter } from './setLineBreakAfter.js'

// In EJS
let inEJS = false

// Current indent (code)
let currentIndent = 0

// Current indent (EJS)
let currentEJSIndent = 0

/**
 * Beautify block start
 * @param node Node
 */
const beautifyBlockStart = (node: NodeLR): void => {
  if (node.enableEJS) {
    eatAllIndent(node, inEJS ? currentEJSIndent : currentIndent)
    inEJS = true
    if (node.ejs?.indent) currentEJSIndent += node.dir
  } else if (inEJS) {
    if (node.ejs?.indent) currentEJSIndent += node.dir
  } else if (node.freefem?.indent) {
    currentIndent += node.dir
  }

  setSpaceBefore(node, inEJS)
  setLineBreakBefore(node, inEJS)

  setLineBreakAfter(node, inEJS)
  setSpaceAfter(node, inEJS)

  traverseTree(node)
}

/**
 * Beautify block end
 * @param node Node
 */
const beautifyBlockEnd = (node: NodeLR): void => {
  const parent = node.parent.deref()
  if (node.disableEJS) {
    eatAllIndent(node, inEJS ? currentEJSIndent : currentIndent)
    inEJS = false
    if (parent.ejs?.indent) currentEJSIndent += node.dir
  } else if (inEJS) {
    eatIndent(node)
    if (parent.ejs?.indent) currentEJSIndent += node.dir
  } else {
    eatIndent(node)
    currentIndent += node.dir
  }

  setLineBreakBefore(node, inEJS)
  setSpaceBefore(node, inEJS)

  setSpaceAfter(node, inEJS)
  setLineBreakAfter(node, inEJS)
}

/**
 * Beautify block
 * @param node Node
 */
const beautifyBlock = (node: NodeLR): void => {
  if (node.dir > 0) {
    beautifyBlockStart(node)
  } else {
    beautifyBlockEnd(node)
  }
}

/**
 * Beautify operator
 * @param node Node
 */
const beautifyOperator = (node: NodeLR): void => {
  setSpaceBefore(node, inEJS)
  setSpaceAfter(node, inEJS)

  // if (child.value === ';' && indentInProblem) {
  //   // indentInProblem = false
  //   currentIndent--
  // }
}

/**
 * Beautify comment
 * @param node Node
 */
const beautifyComment = (node: NodeLR): void => {
  if (node.name === 'inline') {
    const comment = node.value.substring(2).trim().replace(/\s\s+/g, ' ')
    node.value = '// ' + comment
  } else {
    if (node.dir > 0) {
      node.children
        .filter((c) => c.value)
        .forEach((c) => {
          if (c.name === 'lineBreak') return
          else if (c.name === multilineComment[1].name) c.value = ' ' + c.value
          else c.value = ' * ' + c.value
        })

      traverseTree(node)
    }
  }
}

/**
 * Beautify string
 * @param node Node
 */
const beautifyString = (node: NodeLR): void => {
  if (node.name === 'lineBreak') {
    if (
      node.right?.deref().name === 'lineBreak' &&
      node.right?.deref().right?.deref().name === 'lineBreak'
    )
      removeSelf(node)
    // else setIndent(node, inEJS ? currentEJSIndent : currentIndent)
  } else {
    setSpaceBefore(node, true)
    // setSpaceAfter(node, true)
  }
  // if (
  //   child.value === 'solve' ||
  //   child.value === 'problem' ||
  //   child.value === 'varf'
  // ) {
  //   // indentInProblem = true
  //   currentIndent++
  // }
}

/**
 * Traverse tree
 * @param tree Tree
 */
const traverseTree = (tree: NodeLR): void => {
  if (!tree.children) return

  for (const child of tree.children) {
    switch (child.family) {
      case 'block':
        beautifyBlock(child)
        break
      case 'operator':
        beautifyOperator(child)
        break
      case 'comment':
        beautifyComment(child)
        break
      case 'string':
        beautifyString(child)
        break
      default:
        break
    }
  }
}

/**
 * Beautify tree
 * @param tree Tree
 * @returns Tree
 */
export const beautify = (tree: Tree): Tree => {
  setLeftAndRight(tree)
  // console.dir(tree, { depth: null })

  traverseTree(tree)

  return tree
}
