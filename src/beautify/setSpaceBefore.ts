/** @module Src.Beautify.SetSpaceBefore */

import { NodeLR } from './typedef.js'

import { space } from '../defs/index.js'
import { appendLeft } from './tools.js'

/**
 * Set space before block
 * @param node Node
 * @param inEJS In EJS?
 */
const setSpaceBeforeBlock = (node: NodeLR, inEJS: boolean): void => {
  if (node.dir! > 0) {
    const left = node.left?.deref()
    if (
      left &&
      left.name !== 'lineBreak' &&
      left.name !== 'space' &&
      left.name !== 'indent'
    ) {
      const leftChild = {
        ...space,
        value: space.identifier
      }

      appendLeft(node, leftChild)
    }
  } else {
    const left = node.left?.deref()
    const leftParams = inEJS ? left?.ejs : left?.freefem
    if (
      (left?.isInline ? true : !leftParams?.lineBreakAfter) &&
      left?.name !== 'lineBreak' &&
      left?.name !== 'space' &&
      left?.name !== 'indent'
    ) {
      const leftChild = {
        ...space,
        value: space.identifier
      }

      appendLeft(node, leftChild)
    }
  }
}

const checkLeftBlock = (left?: NodeLR): NodeLR | undefined => {
  if (left?.family === 'block') {
    const children = left.children
    left = children?.[children.length - 1]
  }
  return left
}

/**
 * Set space before
 * @param node Node
 * @param inEJS In EJS?
 * @param force Force
 */
export const setSpaceBefore = (
  node: NodeLR,
  inEJS: boolean,
  force?: true
): void => {
  if (
    force ||
    (inEJS && node.ejs?.spaceBefore) ||
    (!inEJS && node.freefem?.spaceBefore)
  ) {
    if (node.value[0] === '.') return

    if (node.family === 'block') {
      setSpaceBeforeBlock(node, inEJS)
    } else {
      let left = node.left?.deref()

      // Check if left is a block
      left = checkLeftBlock(left)

      if (
        left &&
        left.family !== 'operator' &&
        left.name !== 'lineBreak' &&
        left.name !== 'space' &&
        left.name !== 'indent'
      ) {
        const leftChild = {
          ...space,
          value: space.identifier
        }

        appendLeft(node, leftChild)
      }
    }
  }
}
