import { Def } from '../defs/typedef.js'

export type NodeRef = WeakRef<Node>

export interface Node extends Def {
  value: string
  isInline?: boolean
  children?: Node[]
  parent: NodeRef
}

export interface Tree extends Node {}
