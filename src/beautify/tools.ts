/** @module Src.Beautify.Tools */

import { Node } from '../parse/typedef.js'
import { NodeLR, NodeRefLR } from './typedef.js'

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
export const setLeftAndRight = (node: Node): NodeLR => {
  const nodeLR: NodeLR = node

  nodeLR.children?.map((child, index) => {
    const left = node.children?.[index - 1]
    const right = node.children?.[index + 1]
    child.left = setRef(left)
    child.right = setRef(right)

    return setLeftAndRight(child)
  })

  return nodeLR
}

/**
 * Append left
 * @param node Node
 * @param leftNode Left node
 * @returns Left
 */
export const appendLeft = (
  node: NodeLR,
  leftNode: Omit<Node, 'parent'>
): NodeLR | undefined => {
  const parent = node.parent.deref()!
  const left = node.left?.deref()

  const index = parent.children!.findIndex((c) => c === node)
  if (index == -1) return

  const newNode = {
    ...leftNode,
    left: setRef(left),
    right: setRef(node),
    parent: setRef(parent)!
  }

  left && (left.right = setRef(newNode))
  node.left = setRef(newNode)

  parent.children = [
    ...parent.children!.slice(0, index),
    newNode,
    ...parent.children!.slice(index)
  ]

  return newNode
}

/**
 * Remove left
 * @param node Node
 */
export const removeLeft = (node: NodeLR): void => {
  const parent = node.parent.deref()!
  const index = parent.children!.findIndex((c) => c === node)
  if (index === -1) return

  const leftLeft = node.left?.deref()?.left?.deref()
  leftLeft && (leftLeft.right = setRef(node))
  node.left = setRef(parent.children![index - 2])

  parent.children = [
    ...parent.children!.slice(0, index - 1),
    ...parent.children!.slice(index)
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
): NodeLR | undefined => {
  const parent = node.parent.deref()!
  const right = node.right?.deref()

  const index = parent.children!.findIndex((c) => c === node)
  if (index == -1) return

  const newNode = {
    ...rightNode,
    left: setRef(node),
    right: setRef(right),
    parent: setRef(parent)!
  }

  right && (right.left = setRef(newNode))
  node.right = setRef(newNode)

  parent.children = [
    ...parent.children!.slice(0, index + 1),
    newNode,
    ...parent.children!.slice(index + 1)
  ]

  return newNode
}

/**
 * Remove right
 * @param node Node
 */
const removeRight = (node: NodeLR): void => {
  const parent = node.parent.deref()!
  const index = parent.children!.findIndex((c) => c === node)
  if (index === -1) return

  const rightRight = node.right?.deref()?.right?.deref()
  rightRight && (rightRight.left = setRef(node))
  node.right = setRef(parent.children![index + 2])

  parent.children = [
    ...parent.children!.slice(0, index),
    ...parent.children!.slice(index + 1)
  ]
}

/**
 * Remove self
 * @param node Node
 */
export const removeSelf = (node: NodeLR): void => {
  const parent = node.parent.deref()!
  const index = parent.children!.findIndex((c) => c === node)
  if (index === -1) return

  parent.children?.[index - 1] &&
    (parent.children[index - 1].right = setRef(parent.children[index + 1]))
  parent.children?.[index + 1] &&
    (parent.children[index + 1].left = setRef(parent.children[index - 1]))

  parent.children = [
    ...parent.children!.slice(0, index),
    ...parent.children!.slice(index + 1)
  ]
}
