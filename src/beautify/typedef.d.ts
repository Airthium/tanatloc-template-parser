import { Node } from '../parse/typedef.js'

export type NodeRefLR = WeakRef<NodeLR>

export interface NodeLR extends Omit<Node, 'children' | 'parent'> {
  left?: NodeRefLR
  right?: NodeRefLR
  children?: NodeLR[]
  parent: NodeRefLR
}

export interface TreeLR extends NodeLR {}
