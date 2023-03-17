import { NodeLR } from './typedef.js'

import { removeSelf } from './tools.js'

/**
 * Eat line break
 * @param node Node
 * @param inEJS In EJS?
 */
export const eatLineBreakBefore = (node: NodeLR, inEJS: boolean): void => {
  if (inEJS ? node.ejs?.eatLineBreakBefore : node.freefem?.eatLineBreakBefore) {
    // Always a block before, check last child of the block
    const left = node.left?.deref()
    const children = left?.children
    if (!children) return
    const lastChild = children[children.length - 1]
    if (lastChild?.name === 'lineBreak') removeSelf(lastChild)
  }
}
