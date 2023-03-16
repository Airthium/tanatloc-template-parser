import { NodeLR } from './typedef.js'

import { space } from '../defs/index.js'
import { appendRight } from './tools.js'

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
    const right = node.right?.deref()
    if (right && right.name !== 'lineBreak' && right.name !== 'space') {
      const rightChild = {
        ...space,
        value: space.identifier
      }

      appendRight(node, rightChild)
    }
  }
}
