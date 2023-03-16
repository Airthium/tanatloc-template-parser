import { NodeLR } from './typedef.js'

import { space } from '../defs/index.js'
import { appendLeft } from './tools.js'

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
    const left = node.left?.deref()
    if (left && left.name !== 'lineBreak' && left.name !== 'space') {
      const leftChild = {
        ...space,
        value: space.identifier
      }

      appendLeft(node, leftChild)
    }
  }
}
