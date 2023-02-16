const indentLength = 4

let inEJS = true

export const stringify = (tree, indent = 0) => {
  let code = ''

  if (!tree.children) return

  for (const child of tree.children) {
    // Blocks
    if (child.family === 'blocks') {
      let beginStart = ''
      let endStart = ''
      if (code.length && code.slice(-1) !== ' ' && code.slice(-1) !== '\n')
        beginStart = ' '
      if (child.lineBreak) {
        endStart = '\n'
        for (let i = 0; i < indentLength * (indent + 1); ++i) {
          endStart += ' '
        }
      } else if (child.type.includes('ejs')) {
        inEJS = true
        endStart = ' '
      }

      code += beginStart + child.start + endStart

      if (child.type === 'block' || child.type === 'ejs') indent++

      code += stringify(child, indent)

      if (child.type === 'block' || child.type === 'ejs') {
        code = code.slice(0, -indentLength)
        indent--
        inEJS = false
      }

      code += child.end
    } else if (child.family === 'operators') {
      let begin = ''
      if (inEJS && code.slice(-1) !== ' ') begin = ''
      if (!inEJS && child.type !== 'transpose' && code.slice(-1) !== ' ')
        begin = ' '

      code += begin + child.value
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
