/** @module Src.Beautify.Types */

import { Node } from '../parse/typedef.js'

/**
 * Node ref with left and right
 */
export type NodeRefLR = WeakRef<NodeLR>

/**
 * Node with left and right
 */
export interface NodeLR extends Omit<Node, 'children' | 'parent'> {
  left?: NodeRefLR
  right?: NodeRefLR
  children?: NodeLR[]
  parent: NodeRefLR
}

/**
 * Tree with left and right
 */
export interface TreeLR extends NodeLR {}
