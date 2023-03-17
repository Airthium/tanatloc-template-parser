import colors from 'colors'

import { NodeLR } from './typedef.js'

import { lineBreak } from '../defs/index.js'
import { appendLeft } from './tools.js'

/**
 * Set line break before block
 * @param node Node
 * @param inEJS In EJS?
 */
const setLineBreakBeforeBlock = (node: NodeLR, inEJS: boolean): void => {
  if (node.dir! > 0) {
    console.warn(
      colors.yellow(
        '⚠ ' +
          setLineBreakBeforeBlock.name +
          ' not implemented for dir ' +
          node.dir
      )
    )
  } else {
    const left = node.left?.deref()
    const params = inEJS ? left?.ejs : left?.freefem
    if (
      !params?.lineBreakAfter &&
      left?.name !== 'lineBreak' &&
      left?.name !== 'indent'
    ) {
      const leftChild = {
        ...lineBreak,
        value: lineBreak.identifier
      }
      appendLeft(node, leftChild)
    }
  }
}

/**
 * Set line break before
 * @param node Node
 * @param inEJS In EJS?
 */
export const setLineBreakBefore = (node: NodeLR, inEJS: boolean): void => {
  if (
    (inEJS && node.ejs?.lineBreakBefore) ||
    (!inEJS && node.freefem?.lineBreakBefore)
  ) {
    if (node.family === 'block') {
      setLineBreakBeforeBlock(node, inEJS)
    } else {
      console.warn(
        colors.yellow(
          '⚠ ' +
            setLineBreakBefore.name +
            ' not implemented for family ' +
            node.family
        )
      )
    }
  }
}
