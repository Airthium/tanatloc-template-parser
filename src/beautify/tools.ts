import { Node } from '../parse/typedef.js'
import { NodeLR, NodeRefLR } from './typedef.js'

import { space } from '../defs/index.js'

// Indent length
const indentLength = 4

/**
 * Set reference
 * @param node Node
 * @returns Ref
 */
const setRef = (node?: NodeLR): NodeRefLR | undefined => {
  return node ? new WeakRef(node) : undefined
}

/**
 * Set left and right
 * @param node Node
 */
export const setLeftAndRight = (node: Node): void => {
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
export const setIndent = (node: NodeLR, indent: number): void => {
  const numberOfSpaces = indent * indentLength

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
export const eatIndent = (node: NodeLR): void => {
  const parent = node.parent.deref()
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
export const eatAllIndent = (node: NodeLR, indent: number): void => {
  for (let i = 0; i < indent; ++i) eatIndent(node)
}

/**
 * Append left
 * @param node Node
 * @param leftNode Left node
 */
export const appendLeft = (
  node: NodeLR,
  leftNode: Omit<Node, 'parent'>
): void => {
  const parent = node.parent.deref()
  const left = node.left?.deref()

  const index = parent.children.findIndex((c) => c === node)
  if (index == -1) return

  left && (left.right = setRef({ ...leftNode, parent: setRef(parent) }))
  node.left = setRef({ ...leftNode, parent: setRef(parent) })

  parent.children = [
    ...parent.children.slice(0, index),
    {
      ...leftNode,
      left: setRef(left),
      right: setRef(node),
      parent: setRef(parent)
    },
    ...parent.children.slice(index)
  ]
}

/**
 * Remove left
 * @param node Node
 */
const removeLeft = (node: NodeLR): void => {
  const parent = node.parent.deref()
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
export const appendRight = (
  node: NodeLR,
  rightNode: Omit<Node, 'parent'>
): void => {
  const parent = node.parent.deref()
  const right = node.right?.deref()

  const index = parent.children.findIndex((c) => c === node)
  if (index == -1) return

  right && (right.left = setRef({ ...rightNode, parent: setRef(parent) }))
  node.right = setRef({ ...rightNode, parent: setRef(parent) })

  parent.children = [
    ...parent.children.slice(0, index + 1),
    {
      ...rightNode,
      left: setRef(node),
      right: setRef(right),
      parent: setRef(parent)
    },
    ...parent.children.slice(index + 1)
  ]
}

/**
 * Remove right
 * @param node Node
 */
const removeRight = (node: NodeLR): void => {
  const parent = node.parent.deref()
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
export const removeSelf = (node: NodeLR): void => {
  const parent = node.parent.deref()
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
