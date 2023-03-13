import { lineBreak, multilineComment, space } from './defs.js'
import { Node, Tree } from './parse.js'

// Indent length
const indentLength = 4

// In EJS
let inEJS = false

// Current indent (code)
let currentIndent = 0

// Current indent (EJS)
let currentEJSIndent = 0

/**
 * Set left and right
 * @param node Node
 */
const setLeftAndRight = (node: Node): void => {
  node.children?.forEach((child, index) => {
    child.left = node.children[index - 1]
    child.right = node.children[index + 1]

    setLeftAndRight(child)
  })
}

export const setIndent = (parent: Node, lineBreak: Node): void => {
  const index = parent.children.findIndex((c) => c === lineBreak)
  if (index === -1) return

  const numberOfSpaces =
    (inEJS ? currentEJSIndent : currentIndent) * indentLength

  // Indents
  const indents = []
  for (let i = 0; i < numberOfSpaces; ++i) {
    const indent = {
      ...space,
      value: space.identifier,
      parent: parent
    }
    indents.push(indent)
  }

  // Left right
  for (let i = 0; i < numberOfSpaces; ++i) {
    indents[i].left = indents[i - 1]?.left ?? lineBreak
    indents[i].right = indents[i + 1]?.right ?? parent.children[index + 1]
  }

  // Append
  for (let i = 0; i < numberOfSpaces; ++i) {
    appendRight(parent, lineBreak, indents[i])
  }
}

export const eatIndent = (parent: Node, child: Node): void => {
  const index = parent.children.findIndex((c) => c === child)
  if (index === -1) return

  const numberOfSpaces = indentLength

  // Check
  let ok = true
  for (let i = 0; i < numberOfSpaces; ++i)
    if (parent.children[index - 1 - i]?.type !== 'space') ok = false

  if (ok) for (let i = 0; i < numberOfSpaces; ++i) removeLeft(parent, child)
}

export const eatLineIndent = (parent: Node): void => {
  //@ts-ignore
  const child = parent.children.findLast((c) => c.type === 'line_break')
  const index = parent.children.findIndex((c) => c === child)

  const numberOfSpaces =
    (inEJS ? currentEJSIndent : currentIndent) * indentLength

  // Check
  let ok = true
  for (let i = 0; i < numberOfSpaces; ++i)
    if (parent.children[index - 1 - i]?.type !== 'space') ok = false

  if (ok) for (let i = 0; i < numberOfSpaces; ++i) removeLeft(parent, child)
}

/**
 * Append left
 * @param parent Parent
 * @param child Child
 * @param leftChild Left child
 */
export const appendLeft = (
  parent: Node,
  child: Node,
  leftChild: Node
): void => {
  const left = child.left
  child.left = leftChild

  const index = parent.children.findIndex((c) => c === child)
  if (index == -1) return

  parent.children = [
    ...parent.children.slice(0, index),
    {
      ...leftChild,
      left: left,
      right: child
    },
    ...parent.children.slice(index)
  ]
}

export const removeLeft = (parent: Node, child: Node): void => {
  const index = parent.children.findIndex((c) => c === child)
  if (index === -1) return

  child.left = parent.children[index - 2]

  parent.children = [
    ...parent.children.slice(0, index - 1),
    ...parent.children.slice(index)
  ]
}

/**
 * Append right
 * @param parent Parent
 * @param child Child
 * @param rightChild Right child
 */
export const appendRight = (
  parent: Node,
  child: Node,
  rightChild: Node
): void => {
  const right = child.right
  child.right = rightChild

  const index = parent.children.findIndex((c) => c === child)
  if (index == -1) return

  parent.children = [
    ...parent.children.slice(0, index + 1),
    {
      ...rightChild,
      left: child,
      right: right
    },
    ...parent.children.slice(index + 1)
  ]
}

export const removeRight = (parent: Node, child: Node): void => {
  const index = parent.children.findIndex((c) => c === child)
  if (index === -1) return

  child.right = parent.children[index + 2]

  parent.children = [
    ...parent.children.slice(0, index),
    ...parent.children.slice(index + 1)
  ]
}

export const removeSelf = (parent: Node, child: Node): void => {
  const index = parent.children.findIndex((c) => c === child)
  if (index === -1) return

  parent.children[index - 1].right = parent.children[index + 1]
  parent.children[index + 1].left = parent.children[index - 1]

  parent.children = [
    ...parent.children.slice(0, index),
    ...parent.children.slice(index + 1)
  ]
}

export const beautifyBlock = (parent: Node, child: Node): void => {
  if (child.dir === 1) {
    if (child.enableEJS) {
      eatIndent(parent, child)
      inEJS = true
      currentEJSIndent++
    } else {
      currentIndent++
    }

    if (child.spaceBefore) {
      const left = child.left
      if (left && (left.type == 'string' || left.family === 'block')) {
        const leftChild = {
          ...space,
          value: space.identifier,
          parent: parent
        }

        appendLeft(parent, child, leftChild)
      }
    }

    if (child.spaceAfter) {
      const right = child.right
      if (right && right.type !== 'space') {
        const rightChild = {
          ...space,
          value: space.identifier,
          parent: parent
        }

        appendRight(parent, child, rightChild)
      }
    }

    if (child.lineBreakAfter) {
      if (child.children[0].type !== 'line_break') {
        const firstChild = {
          ...lineBreak,
          value: lineBreak.identifier,
          right: child.children[0],
          parent: child
        }
        child.children = [firstChild, ...child.children]
      }
    }

    traverseTree(child)
  } else {
    if (child.disableEJS) {
      inEJS = false
      currentEJSIndent--
    } else {
      currentIndent--
    }
    eatIndent(parent, child)

    if (child.spaceBefore) {
      const left = child.left
      if (left?.type !== 'space' && left?.type !== 'line_break') {
        const leftChild = {
          ...space,
          value: space.identifier,
          parent: parent
        }

        appendLeft(parent, child, leftChild)
      }
    }

    if (child.lineBreakBefore) {
      // TODO
    }

    if (child.lineBreakAfter) {
      // const rightChild = {
      //   ...lineBreak,
      //   value: lineBreak.identifier,
      //   parent: parent
      // }
      // appendRight(parent, child, rightChild)
      // setIndent(parent, rightChild)
    }
  }
}

export const beautifyOperator = (parent: Node, child: Node): void => {
  if (child.spaceBefore) {
    const left = child.left
    if (
      left?.type !== 'space' &&
      left?.type !== 'line_break' &&
      left?.family !== 'operator'
    ) {
      const leftChild = {
        ...space,
        value: space.identifier,
        parent: parent
      }
      appendLeft(parent, child, leftChild)
    }
  }

  if (child.spaceAfter) {
    const right = child.right
    if (right?.type !== 'space' && right?.type !== 'line_break') {
      const rightChild = {
        ...space,
        value: space.identifier,
        parent: parent
      }

      appendRight(parent, child, rightChild)
    }
  }
}

export const beautifyComment = (_: Node, child: Node): void => {
  if (child.type === 'inline') {
    const comment = child.value.substring(2).trim().replace(/\s\s+/g, ' ')
    child.value = '// ' + comment
  } else {
    if (child.dir === 1) {
      child.children
        .filter((c) => c.value)
        .forEach((c) => {
          if (c.type === 'line_break') return
          else if (c.type === multilineComment[1].type) c.value = ' ' + c.value
          else c.value = ' * ' + c.value
        })
      traverseTree(child)
    }
  }
}

export const beautifyString = (parent: Node, child: Node): void => {
  if (child.type === 'line_break') {
    if (
      child.right?.type === 'line_break' &&
      child.right?.right?.type === 'line_break'
    )
      removeSelf(parent, child)
    else setIndent(parent, child)
  }
}

const traverseTree = (tree: Node): void => {
  if (!tree.children) return

  for (const child of tree.children) {
    switch (child.family) {
      case 'block':
        beautifyBlock(tree, child)
        break
      case 'operator':
        beautifyOperator(tree, child)
        break
      case 'comment':
        beautifyComment(tree, child)
        break
      case 'string':
        beautifyString(tree, child)
        break
      default:
        break
    }
  }
}

export const beautify = (tree: Tree): Tree => {
  setLeftAndRight(tree)

  traverseTree(tree)

  return tree
}
