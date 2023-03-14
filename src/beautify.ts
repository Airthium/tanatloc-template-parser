import { lineBreak, multilineComment, space } from './defs.js'
import { Node, Tree } from './parse.js'

export interface NodeLR extends Node {
  left?: WeakRef<NodeLR>
  right?: WeakRef<NodeLR>
  children?: NodeLR[]
}

// Indent length
const indentLength = 4

// In EJS
let inEJS = false

// Current indent (code)
let currentIndent = 0

// Current indent (EJS)
let currentEJSIndent = 0

// Indent in problem
let indentInProblem = false

/**
 * Set left and right
 * @param node Node
 */
const setLeftAndRight = (node: NodeLR): void => {
  node.children?.forEach((child, index) => {
    const left = node.children[index - 1]
    const right = node.children[index + 1]
    child.left = left ? new WeakRef(left) : undefined
    child.right = right ? new WeakRef(right) : undefined

    setLeftAndRight(child)
  })
}

export const setIndent = (parent: NodeLR, lineBreak: NodeLR): void => {
  const index = parent.children.findIndex((c) => c === lineBreak)
  if (index === -1) return

  const numberOfSpaces =
    (inEJS ? currentEJSIndent : currentIndent) * indentLength

  // Indents
  const indents: NodeLR[] = []
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
    indents[i].left =
      indents[i - 1] ?? lineBreak
        ? new WeakRef(indents[i - 1] ?? lineBreak)
        : undefined
    indents[i].right =
      indents[i + 1] ?? parent.children[index + 1]
        ? new WeakRef(indents[i + 1] ?? parent.children[index + 1])
        : undefined
  }

  // Append
  for (let i = 0; i < numberOfSpaces; ++i) {
    appendRight(parent, lineBreak, indents[i])
  }
}

export const eatIndent = (parent: NodeLR, child: NodeLR): void => {
  const index = parent.children.findIndex((c) => c === child)
  if (index === -1) return

  const numberOfSpaces = indentLength

  // Check
  let ok = true
  for (let i = 0; i < numberOfSpaces; ++i)
    if (parent.children[index - 1 - i]?.type !== 'space') ok = false

  if (ok) for (let i = 0; i < numberOfSpaces; ++i) removeLeft(parent, child)
}

export const eatLineIndent = (parent: NodeLR): void => {
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
  parent: NodeLR,
  child: NodeLR,
  leftChild: Node
): void => {
  const left = child.left
  child.left = new WeakRef(leftChild)

  const index = parent.children.findIndex((c) => c === child)
  if (index == -1) return

  parent.children = [
    ...parent.children.slice(0, index),
    {
      ...leftChild,
      left: left,
      right: new WeakRef(child)
    },
    ...parent.children.slice(index)
  ]
}

export const removeLeft = (parent: NodeLR, child: NodeLR): void => {
  const index = parent.children.findIndex((c) => c === child)
  if (index === -1) return

  child.left = new WeakRef(parent.children[index - 2])

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
  parent: NodeLR,
  child: NodeLR,
  rightChild: Node
): void => {
  const right = child.right
  child.right = new WeakRef(rightChild)

  const index = parent.children.findIndex((c) => c === child)
  if (index == -1) return

  parent.children = [
    ...parent.children.slice(0, index + 1),
    {
      ...rightChild,
      left: new WeakRef(child),
      right: right
    },
    ...parent.children.slice(index + 1)
  ]
}

export const removeRight = (parent: NodeLR, child: NodeLR): void => {
  const index = parent.children.findIndex((c) => c === child)
  if (index === -1) return

  child.right = new WeakRef(parent.children[index + 2])

  parent.children = [
    ...parent.children.slice(0, index),
    ...parent.children.slice(index + 1)
  ]
}

export const removeSelf = (parent: NodeLR, child: NodeLR): void => {
  const index = parent.children.findIndex((c) => c === child)
  if (index === -1) return

  parent.children[index - 1].right = new WeakRef(parent.children[index + 1])
  parent.children[index + 1].left = new WeakRef(parent.children[index - 1])

  parent.children = [
    ...parent.children.slice(0, index),
    ...parent.children.slice(index + 1)
  ]
}

export const beautifyBlock = (parent: NodeLR, child: NodeLR): void => {
  if (child.dir > 0) {
    if (child.enableEJS) {
      for (let i = 0; i < currentIndent; ++i) eatIndent(parent, child)
      inEJS = true
      if (child.indentEJS) currentEJSIndent += child.dir
    } else if (inEJS) {
      if (child.indentEJS) currentEJSIndent += child.dir
    } else {
      currentIndent += child.dir
    }

    if (child.spaceBefore) {
      const left = child.left?.deref()
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
      const leftChild = {
        ...space,
        value: space.identifier,
        parent: parent
      }
      appendLeft(child, child.children[0], leftChild)
    }

    if (child.lineBreakAfter) {
      if (child.children[0].type !== 'line_break') {
        const leftChild = {
          ...lineBreak,
          value: lineBreak.identifier,
          right: new WeakRef(child.children[0]),
          parent: child
        }
        appendLeft(child, child.children[0], leftChild)
      }
    }

    traverseTree(child)
  } else {
    if (child.disableEJS) {
      for (let i = 0; i < currentEJSIndent; ++i) eatIndent(parent, child)

      inEJS = false
      if (child.indentEJS) currentEJSIndent += child.dir
      if (!child.indentEJS && parent.indentEJS) currentEJSIndent += child.dir
    } else if (inEJS) {
      eatIndent(parent, child)
      if (child.indentEJS) currentEJSIndent += child.dir
    } else {
      eatIndent(parent, child)
      currentIndent += child.dir
    }

    if (child.spaceBefore) {
      const left = child.left?.deref()
      if (
        !left?.indentEJS &&
        left?.type !== 'space' &&
        left?.type !== 'line_break'
      ) {
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

    const right = parent.right?.deref()
    if (right?.value === 'catch' || right?.value === 'else') {
      const rightChild = {
        ...space,
        value: space.identifier,
        parent: parent
      }
      appendRight(parent, child, rightChild)
    }

    if (child.lineBreakAfter) {
      if (
        right?.type !== 'line_break' &&
        right?.value !== 'catch' &&
        right?.value !== 'else'
      ) {
        const rightChild = {
          ...lineBreak,
          value: lineBreak.identifier,
          parent: parent
        }
        appendRight(parent, child, rightChild)
        //indent
      }
    }
  }
}

export const beautifyOperator = (parent: NodeLR, child: NodeLR): void => {
  if (child.spaceBefore) {
    const left = child.left?.deref()
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
    const right = child.right?.deref()
    if (right?.type !== 'space' && right?.type !== 'line_break') {
      const rightChild = {
        ...space,
        value: space.identifier,
        parent: parent
      }

      appendRight(parent, child, rightChild)
    }
  }

  if (child.value === ';' && indentInProblem) {
    indentInProblem = false
    currentIndent--
  }
}

export const beautifyComment = (_: NodeLR, child: NodeLR): void => {
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

export const beautifyString = (parent: NodeLR, child: NodeLR): void => {
  if (child.type === 'line_break') {
    if (
      child.right?.deref().type === 'line_break' &&
      child.right?.deref().right?.deref().type === 'line_break'
    )
      removeSelf(parent, child)
    else setIndent(parent, child)
  }

  if (
    child.value === 'for' ||
    child.value === 'if' ||
    child.value === 'catch'
  ) {
    const rightChild = {
      ...space,
      value: space.identifier,
      parent: parent
    }

    appendRight(parent, child, rightChild)
  }

  if (
    child.value === 'solve' ||
    child.value === 'problem' ||
    child.value === 'varf'
  ) {
    indentInProblem = true
    currentIndent++
  }
}

const traverseTree = (tree: NodeLR): void => {
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
  // console.dir(tree, { depth: null })

  traverseTree(tree)

  return tree
}
