/** @module Src.Beautify.SetSpaceAfter */

import colors from 'colors/safe.js'

import { NodeLR } from './typedef.js'

import { space } from '../defs/index.js'
import { appendLeft, appendRight } from './tools.js'

/**
 * Set space after block
 * @param node Node
 */
const setSpaceAfterBlock = (node: NodeLR) => {
  if (node.dir! > 0) {
    const firstChild = node.children?.[0]
    if (
      firstChild?.name !== 'lineBreak' &&
      firstChild?.name !== 'space' &&
      firstChild?.name !== 'indent'
    ) {
      const rightChild = {
        ...space,
        value: space.identifier
      }

      appendLeft(firstChild!, rightChild)
    }
  } else {
    console.warn(
      colors.yellow(
        '⚠ ' + setSpaceAfterBlock.name + ' not implemented for dir ' + node.dir
      )
    )
  }
}

/**
 * Set space after
 * @param node Node
 * @param inEJS In EJS?
 * @param force Force
 */
export const setSpaceAfter = (
  node: NodeLR,
  inEJS: boolean,
  force?: true
): void => {
  if (
    force ||
    (inEJS && node.ejs?.spaceAfter) ||
    (!inEJS && node.freefem?.spaceAfter)
  ) {
    if (node.family === 'block') {
      setSpaceAfterBlock(node)
    } else {
      const right = node.right?.deref()
      if (
        right?.name !== 'lineBreak' &&
        right?.name !== 'space' &&
        right?.name !== 'indent' &&
        !(right?.family === 'block' && right?.dir === -1)
      ) {
        const rightChild = {
          ...space,
          value: space.identifier
        }

        appendRight(node, rightChild)
      }
    }
  }
}
