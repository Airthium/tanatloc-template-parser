import { Tree } from '../parse/typedef.js'
import { NodeLR, TreeLR } from './typedef.js'

import { multilineComment } from '../defs/index.js'
import { setLeftAndRight } from './tools.js'
import { setSpaceBefore } from './setSpaceBefore.js'
import { setSpaceAfter } from './setSpaceAfter.js'
import { setLineBreakBefore } from './setLineBreakBefore.js'
import { setLineBreakAfter } from './setLineBreakAfter.js'
import { indent } from './indent.js'

// In EJS
let inEJS = false

/**
 * Beautify block start
 * @param node Node
 */
const beautifyBlockStart = (node: NodeLR): void => {
  if (node.enableEJS) {
    inEJS = true
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
  setLineBreakBefore(node, inEJS)
  setSpaceBefore(node, inEJS)

  setSpaceAfter(node, inEJS)
  setLineBreakAfter(node, inEJS)

  if (node.disableEJS) {
    inEJS = false
  }
}

/**
 * Beautify block
 * @param node Node
 */
const beautifyBlock = (node: NodeLR): void => {
  if (node.dir! > 0) {
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
    if (node.dir! > 0) {
      node.children
        ?.filter((c) => c.value)
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
  if (node.name !== 'lineBreak') setSpaceBefore(node, inEJS, true)
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
export const beautify = (tree: Tree): TreeLR => {
  const treeLR = setLeftAndRight(tree)
  // console.dir(tree, { depth: null })

  traverseTree(treeLR)

  indent(treeLR)

  return treeLR
}
