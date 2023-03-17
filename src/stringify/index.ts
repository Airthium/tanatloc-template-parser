import { Node, Tree } from '../parse/typedef.js'

/**
 * Stringify simple
 * @param code Code
 * @param child Child
 * @returns Code
 */
const stringifySimple = (code: string, child: Node): string => {
  code += child.value

  return code
}

/**
 * Stringify block
 * @param code Code
 * @param child Child
 * @param indent Indent
 */
const stringifyBlock = (code: string, child: Node, indent: number): string => {
  // Start
  code += child.value

  // Tree children
  code += stringifyLoop(child, indent)

  return code
}

/**
 * Stringify operators
 * @param code Code
 * @param child Child
 * @returns Code
 */
const stringifyOperator = (code: string, child: Node): string =>
  stringifySimple(code, child)

/**
 * Stringify comment
 * @param code Code
 * @param child Child
 */
const stringifyComment = (code: string, child: Node): string => {
  if (child.name === 'inline') code += child.value
  else {
    code += child.value
    code += stringifyLoop(child)
  }

  return code
}

/**
 * Stringify text
 * @param code Code
 * @param child Child
 * @returns Code
 */
const stringifyText = (code: string, child: Node): string =>
  stringifySimple(code, child)

/**
 * Stringify loop
 * @param tree Tree
 * @param indent Indent
 * @returns Code
 */
const stringifyLoop = (tree: Tree, indent = 0): string => {
  let code = ''

  if (!tree.children) return ''

  for (const child of tree.children) {
    // Blocks
    if (child.family === 'block') {
      code = stringifyBlock(code, child, indent)
    } else if (child.family === 'operator') {
      code = stringifyOperator(code, child)
    } else if (child.family === 'comment') {
      code = stringifyComment(code, child)
    } else {
      code = stringifyText(code, child)
    }
  }

  return code
}

/**
 * Stringify
 * @param tree Tree
 * @returns Code
 */
export const stringify = (tree: Tree): string => {
  return stringifyLoop(tree)
}
