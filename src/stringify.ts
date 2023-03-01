import { Node, Tree } from './parse.js'

// Indent length
const indentLength = 4

// // In EJS?
// let inEJS = true

/**
 * Set indent
 * @param indent Indent
 * @returns Spaces
 */
export const setIndent = (indent: number): string => {
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
export const eatIndent = (code: string): string => {
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

  // // Space before?
  // if (
  //   child.spaceBefore &&
  //   code.length &&
  //   code.slice(-1) !== ' ' &&
  //   code.slice(-1) !== '\n'
  // )
  //   beforeStart = ' '

  // // Break line or space after?
  // if (child.indent) {
  //   // Indent
  //   indent++
  // }

  // // EJS
  // if (child.type.includes('ejs')) {
  //   inEJS = true
  //   // afterStart = ' '
  // }

  // Start
  code += beforeStart + child.identifier + afterStart

  // Tree children
  code += stringifyLoop(child, indent)

  // // Space before?
  // if (
  //   child.end?.spaceBefore &&
  //   code.length &&
  //   code.slice(-1) !== ' ' &&
  //   code.slice(-1) !== '\n'
  // ) {
  //   beforeEnd = ' '
  // }

  // // Decrease indent
  // if (child.indent) {
  //   code = eatIndent(code)
  //   indent--
  // }

  // if (child.type.includes('ejs')) {
  //   inEJS = false
  // }

  // End
  code += beforeEnd + child.end.identifier + afterEnd

  return code
}

/**
 * Stringify operators
 * @param code Code
 * @param child Child
 * @returns Code
 */
const stringifyOperator = (code: string, child: Node): string => {
  let begin = ''
  // if (inEJS && code.slice(-1) !== ' ') begin = ' '
  // if (!inEJS && child.type !== 'transpose' && code.slice(-1) !== ' ')
  //   begin = ' '

  code += begin + child.identifier

  return code
}

/**
 * Stringify comment
 * @param code Code
 * @param child Child
 */
const stringifyComment = (
  code: string,
  child: Node,
  indent: number
): string => {
  if (child.type === 'inline') {
    code += child.value
  } else {
    const comment = child.value
    const lines = comment.split('\n')

    lines.forEach((line, index) => {
      code += line

      if (index < line.length - 1) {
        code += '\n'
        // if (index === lines.length - 2) {
        //   code += setIndent(indent)
        // } else {
        //   code += setIndent(indent + 1)
        // }
      }
    })
  }

  return code
}

/**
 * Stringify line break
 * @param code Code
 * @param child Child
 * @param indent Indent
 * @returns Code
 */
const stringifyLineBreak = (
  code: string,
  child: Node,
  indent: number
): string => {
  // if (
  //   !(
  //     child.left?.type === 'line_break' &&
  //     child.left?.left?.type === 'line_break'
  //   )
  // ) {
  // console.log(child?.left?.name)
  // console.log(child?.left?.left?.name)
  // console.log('--------------------------')
  code += '\n'
  // code += setIndent(indent)
  // }

  return code
}

/**
 * Stringify text
 * @param code Code
 * @param child Child
 * @returns Code
 */
const stringifyText = (code: string, child: Node): string => {
  let begin = ''
  // if (
  //   child.value !== ';' &&
  //   code.length &&
  //   code.slice(-1) !== ' ' &&
  //   code.slice(-1) !== '\n' &&
  //   code.slice(-1) !== "'"
  // )
  //   begin = ' '
  code += begin + child.value

  return code
}

/**
 * Stringify others
 * @param code Code
 * @param child Child
 * @param indent Indent
 * @returns
 */
const stringifyOthers = (code: string, child: Node, indent: number): string => {
  if (child.type === 'line_break') {
    code = stringifyLineBreak(code, child, indent)
  } else if (child.type === 'space') {
    code += ' '
  } else {
    code = stringifyText(code, child)
  }

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
    } else if (child.family === 'comment') {
      code = stringifyComment(code, child, indent)
    } else {
      code = stringifyOthers(code, child, indent)
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
