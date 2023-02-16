import { Node, Tree } from './parse.js'

// Indent length
const indentLength = 4

// In EJS?
let inEJS = true

/**
 * Set indent
 * @param indent Indent
 * @returns Spaces
 */
const setIndent = (indent: number): string => {
  let spaces = ''

  for (let i = 0; i < indentLength * indent; ++i) {
    spaces += ' '
  }

  return spaces
}

/**
 * Eat indent
 * @param code Code
 * @returns Code
 */
const eatIndent = (code: string): string => {
  return code.slice(0, -indentLength)
}

/**
 * Stringify block
 * @param code Code
 * @param child Child
 * @param indent Indent
 */
const stringifyBlock = (code: string, child: Node, indent: number): string => {
  let beforeStart = ''
  let afterStart = ''
  let beforeEnd = ''
  let afterEnd = ''

  // Increase indent
  if (child.type === 'block' || child.type === 'ejs') indent++

  // Space before?
  if (
    child.spaceBefore &&
    code.length &&
    code.slice(-1) !== ' ' &&
    code.slice(-1) !== '\n'
  )
    beforeStart = ' '

  // Break line or space after?
  if (child.lineBreak) {
    afterStart = '\n'
    // Indent
    afterStart += setIndent(indent)
  } else if (child.type.includes('ejs')) {
    inEJS = true
    afterStart = ' '
  }

  // Start
  code += beforeStart + child.start + afterStart

  // Tree children
  code += stringifyLoop(child, indent)

  // Indent
  if (child.type === 'block' || child.type === 'ejs') {
    // Decrease indent
    code = eatIndent(code)
    indent--

    inEJS = false
  }

  // Break line after?
  if (child.lineBreak) {
    afterEnd = '\n'
    afterEnd += setIndent(indent)
  }

  // End
  code += beforeEnd + child.end + afterEnd

  return code
}

const stringifyOperator = (code: string, child: Node): string => {
  let begin = ''
  if (inEJS && code.slice(-1) !== ' ') begin = ''
  if (!inEJS && child.type !== 'transpose' && code.slice(-1) !== ' ')
    begin = ' '

  code += begin + child.value

  return code
}

/**
 * Stringify loop
 * @param tree Tree
 * @param indent Indent
 * @returns Code
 */
const stringifyLoop = (tree: Tree, indent = 0): string => {
  let code = ''

  if (!tree.children) return

  for (const child of tree.children) {
    // Blocks
    if (child.family === 'blocks') {
      code = stringifyBlock(code, child, indent)
    } else if (child.family === 'operators') {
      code = stringifyOperator(code, child)
    } else {
      if (child.type === 'line_break') {
        if (code.slice(-1) !== '') {
          code += '\n'
          for (let i = 0; i < indentLength * indent; ++i) {
            code += ' '
          }
        }
      } else if (child.type === 'space') {
        code += ' '
      } else {
        let begin = ''
        if (
          child.value !== ';' &&
          code.length &&
          code.slice(-1) !== ' ' &&
          code.slice(-1) !== '\n' &&
          code.slice(-1) !== "'"
        )
          begin = ' '
        code += begin + child.value
      }
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
