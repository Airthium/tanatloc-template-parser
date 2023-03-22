/** @module Src.Parse.Types */

import { Def } from '../defs/typedef.js'

/**
 * Node ref
 */
export type NodeRef = WeakRef<Node>

/**
 * Node
 */
export interface Node extends Def {
  value: string
  isInline?: boolean
  children?: Node[]
  parent: NodeRef
}

/**
 * Tree
 */
export interface Tree extends Node {}
