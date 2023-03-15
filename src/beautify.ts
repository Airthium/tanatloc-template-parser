import { lineBreak, multilineComment, space } from './defs.js'
import { Node, Tree } from './parse.js'

export type NodeRef = WeakRef<NodeLR>

export interface NodeLR extends Node {
  left?: NodeRef
  right?: NodeRef
  children?: NodeLR[]
  parent: NodeLR
}

// Indent length
const indentLength = 4

// In EJS
let inEJS = false

// Current indent (code)
let currentIndent = 0

// Current indent (EJS)
let currentEJSIndent = 0

/**
 * Set reference
 * @param node Node
 * @returns Ref
 */
const setRef = (node?: Node): NodeRef | undefined => {
  return node ? new WeakRef(node) : undefined
}

/**
 * Set left and right
 * @param node Node
 */
const setLeftAndRight = (node: Node): void => {
  const nodeLR: NodeLR = node

  nodeLR.children?.forEach((child, index) => {
    const left = node.children[index - 1]
    const right = node.children[index + 1]
    child.left = setRef(left)
    child.right = setRef(right)

    setLeftAndRight(child)
  })
}

/**
 * Set indent
 * @param node Node
 */
const setIndent = (node: NodeLR): void => {
  const numberOfSpaces =
    (inEJS ? currentEJSIndent : currentIndent) * indentLength

  // Indents
  const indents: NodeLR[] = []
  for (let i = 0; i < numberOfSpaces; ++i) {
    const indent = {
      ...space,
      value: space.identifier,
      parent: node.parent
    }
    indents.push(indent)
  }

  // Left right
  for (let i = 0; i < numberOfSpaces; ++i) {
    indents[i].left = setRef(indents[i - 1] ?? node)
    indents[i].right = setRef(indents[i + 1] ?? node.right?.deref())
  }

  // Append
  for (let i = 0; i < numberOfSpaces; ++i) {
    appendRight(node, indents[i])
  }
}

/**
 * Eat indent
 * @param node Node
 */
const eatIndent = (node: NodeLR): void => {
  const parent = node.parent
  const index = parent.children.findIndex((c) => c === node)
  if (index === -1) return

  const numberOfSpaces = indentLength

  // Check
  let ok = true
  for (let i = 0; i < numberOfSpaces; ++i)
    if (parent.children[index - 1 - i]?.name !== 'space') ok = false

  if (ok) for (let i = 0; i < numberOfSpaces; ++i) removeLeft(node)
}

/**
 * Eat all indent
 * @param node Node
 */
const eatAllIndent = (node: NodeLR): void => {
  for (let i = 0; i < (inEJS ? currentEJSIndent : currentIndent); ++i)
    eatIndent(node)
}

/**
 * Append left
 * @param node Node
 * @param leftNode Left node
 */
const appendLeft = (node: NodeLR, leftNode: Omit<Node, 'parent'>): void => {
  const parent = node.parent
  const left = node.left

  const index = parent.children.findIndex((c) => c === node)
  if (index == -1) return

  node.left = setRef({ ...leftNode, parent })

  parent.children = [
    ...parent.children.slice(0, index),
    {
      ...leftNode,
      left,
      right: setRef(node),
      parent
    },
    ...parent.children.slice(index)
  ]
}

/**
 * Remove left
 * @param node Node
 */
const removeLeft = (node: NodeLR): void => {
  const parent = node.parent
  const index = parent.children.findIndex((c) => c === node)
  if (index === -1) return

  node.left = setRef(parent.children[index - 2])

  parent.children = [
    ...parent.children.slice(0, index - 1),
    ...parent.children.slice(index)
  ]
}

/**
 * Append right
 * @param node Node
 * @param rightNode Right node
 */
const appendRight = (node: NodeLR, rightNode: Omit<Node, 'parent'>): void => {
  const parent = node.parent
  const right = node.right

  const index = parent.children.findIndex((c) => c === node)
  if (index == -1) return

  node.right = setRef({ ...rightNode, parent })

  parent.children = [
    ...parent.children.slice(0, index + 1),
    {
      ...rightNode,
      left: setRef(node),
      right,
      parent
    },
    ...parent.children.slice(index + 1)
  ]
}

/**
 * Remove right
 * @param node Node
 */
const removeRight = (node: NodeLR): void => {
  const parent = node.parent
  const index = parent.children.findIndex((c) => c === node)
  if (index === -1) return

  node.right = setRef(parent.children[index + 2])

  parent.children = [
    ...parent.children.slice(0, index),
    ...parent.children.slice(index + 1)
  ]
}

/**
 * Remove self
 * @param node Node
 */
const removeSelf = (node: NodeLR): void => {
  const parent = node.parent
  const index = parent.children.findIndex((c) => c === node)
  if (index === -1) return

  parent.children[index - 1] &&
    (parent.children[index - 1].right = setRef(parent.children[index + 1]))
  parent.children[index + 1] &&
    (parent.children[index + 1].left = setRef(parent.children[index - 1]))

  parent.children = [
    ...parent.children.slice(0, index),
    ...parent.children.slice(index + 1)
  ]
}

/**
 * Set space before
 * @param node Node
 */
const setSpaceBefore = (node: NodeLR, force?: true): void => {
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

/**
 * Set space after
 * @param node Node
 */
const setSpaceAfter = (node: NodeLR, force?: true): void => {
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

/**
 * Set line break before
 * @param node Node
 */
const setLineBreakBefore = (node: NodeLR): void => {
  if (
    (inEJS && node.ejs?.lineBreakBefore) ||
    (!inEJS && node.freefem?.lineBreakBefore)
  ) {
    const left = node.left?.deref()
    if (!left || (left && left.name !== 'lineBreak')) {
      const leftChild = {
        ...lineBreak,
        value: lineBreak.identifier
      }

      appendLeft(node, leftChild)
    }
  }
}

/**
 * Set line break after
 * @param node Node
 */
const setLineBreakAfter = (node: NodeLR): void => {
  if (
    (inEJS && node.ejs?.lineBreakAfter) ||
    (!inEJS && node.freefem?.lineBreakAfter)
  ) {
    const right = node.parent.right?.deref()

    if (right?.name !== 'lineBreak') {
      const rightChild = {
        ...lineBreak,
        value: lineBreak.identifier
      }

      appendRight(node, rightChild)
    }
  }
}

/**
 * Beautify block start
 * @param node Node
 */
const beautifyBlockStart = (node: NodeLR): void => {
  if (node.enableEJS) {
    eatAllIndent(node)
    inEJS = true
    if (node.ejs?.indent) currentEJSIndent += node.dir
  } else if (inEJS) {
    if (node.ejs?.indent) currentEJSIndent += node.dir
  } else if (node.freefem?.indent) {
    currentIndent += node.dir
  }

  setSpaceBefore(node)
  setSpaceAfter(node)
  setLineBreakBefore(node)
  setLineBreakAfter(node)

  traverseTree(node)
}

/**
 * Beautify block end
 * @param node Node
 */
const beautifyBlockEnd = (node: NodeLR): void => {
  if (node.disableEJS) {
    eatAllIndent(node)
    inEJS = false
    if (node.parent.ejs?.indent) currentEJSIndent += node.dir
  } else if (inEJS) {
    eatIndent(node)
    if (node.parent.ejs?.indent) currentEJSIndent += node.dir
  } else {
    eatIndent(node)
    currentIndent += node.dir
  }

  setSpaceBefore(node)
  setSpaceAfter(node)
  setLineBreakBefore(node)
  setLineBreakAfter(node)
}

/**
 * Beautify block
 * @param node Node
 */
const beautifyBlock = (node: NodeLR): void => {
  if (node.dir > 0) {
    beautifyBlockStart(node)
  } else {
    beautifyBlockEnd(node)
  }
}

/**
 * Beautify operator
 * @param node Node
 */
const beautifyOperator = (node: NodeLR): void => {
  setSpaceBefore(node)
  setSpaceAfter(node)

  // if (child.value === ';' && indentInProblem) {
  //   // indentInProblem = false
  //   currentIndent--
  // }
}

/**
 * Beautify comment
 * @param node Node
 */
const beautifyComment = (node: NodeLR): void => {
  if (node.name === 'inline') {
    const comment = node.value.substring(2).trim().replace(/\s\s+/g, ' ')
    node.value = '// ' + comment
  } else {
    if (node.dir > 0) {
      node.children
        .filter((c) => c.value)
        .forEach((c) => {
          if (c.name === 'lineBreak') return
          else if (c.name === multilineComment[1].name) c.value = ' ' + c.value
          else c.value = ' * ' + c.value
        })

      traverseTree(node)
    }
  }
}

const beautifyString = (node: NodeLR): void => {
  if (node.name === 'lineBreak') {
    if (
      node.right?.deref().name === 'lineBreak' &&
      node.right?.deref().right?.deref().name === 'lineBreak'
    )
      removeSelf(node)
    else setIndent(node)
  } else {
    setSpaceBefore(node, true)
    // setSpaceAfter(node, true)
  }
  // if (
  //   child.value === 'solve' ||
  //   child.value === 'problem' ||
  //   child.value === 'varf'
  // ) {
  //   // indentInProblem = true
  //   currentIndent++
  // }
}

/**
 * Traverse tree
 * @param tree Tree
 */
const traverseTree = (tree: NodeLR): void => {
  if (!tree.children) return

  for (const child of tree.children) {
    switch (child.family) {
      case 'block':
        beautifyBlock(child)
        break
      case 'operator':
        beautifyOperator(child)
        break
      case 'comment':
        beautifyComment(child)
        break
      case 'string':
        beautifyString(child)
        break
      default:
        break
    }
  }
}

/**
 * Beautify tree
 * @param tree Tree
 * @returns Tree
 */
export const beautify = (tree: Tree): Tree => {
  setLeftAndRight(tree)
  // console.dir(tree, { depth: null })

  traverseTree(tree)

  return tree
}
