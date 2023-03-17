import colors from 'colors'

import { NodeLR } from './typedef.js'

import { space } from '../defs/index.js'
import { appendLeft, appendRight } from './tools.js'

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
      const left = node.left?.deref()
      const right = node.right?.deref()
      if (
        left?.name !== 'lineBreak' &&
        left?.name !== 'space' &&
        left?.name !== 'indent' &&
        right?.name !== 'lineBreak' &&
        right?.name !== 'space' &&
        right?.name !== 'indent'
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
