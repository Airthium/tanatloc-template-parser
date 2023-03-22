/** @module Src.Beautify.SetLineBreakAfter */

import colors from 'colors/safe.js'

import { NodeLR } from './typedef.js'

import { lineBreak } from '../defs/index.js'
import { appendLeft, appendRight } from './tools.js'

/**
 * Set line break after block
 * @param node Node
 * @param inEJS In EJS?
 */
const setLineBreakAfterBlock = (node: NodeLR, inEJS: boolean): void => {
  const params = inEJS ? node.ejs : node.freefem
  if (params?.keepInline && node.isInline) return

  if (node.dir! > 0) {
    const firstChild = node.children?.[0]
    if (firstChild && firstChild.name !== 'lineBreak') {
      const leftChild = {
        ...lineBreak,
        value: lineBreak.identifier
      }
      appendLeft(firstChild, leftChild)
    }
  } else {
    const parentRight = node.parent.deref()!.right?.deref()
    if (parentRight && parentRight.name !== 'lineBreak') {
      const rightChild = {
        ...lineBreak,
        value: lineBreak.identifier
      }
      appendRight(node, rightChild)
    }
  }
}

/**
 * Set line break after
 * @param node Node
 * @param inEJS In EJS?
 */
export const setLineBreakAfter = (node: NodeLR, inEJS: boolean): void => {
  if (
    (inEJS && node.ejs?.lineBreakAfter) ||
    (!inEJS && node.freefem?.lineBreakAfter)
  ) {
    if (node.family === 'block') {
      setLineBreakAfterBlock(node, inEJS)
    } else {
      console.warn(
        colors.yellow(
          '⚠ ' +
            setLineBreakAfter.name +
            ' not implemented for family ' +
            node.family
        )
      )
    }
  }
}
