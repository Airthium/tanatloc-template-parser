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
    const params = inEJS ? left?.ejs : left?.freefem
    if (
      !params?.lineBreakAfter &&
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
  }
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
    if (node.family === 'block') {
      setSpaceBeforeBlock(node, inEJS)
    } else {
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
    }
  }
}
