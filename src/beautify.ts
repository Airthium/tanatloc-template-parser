import { Node, Tree } from './parse.js'

/**
 * Set left and right
 * @param node Node
 */
const setLeftAndRight = (node: Node): void => {
  node.children?.forEach((child, index) => {
    child.left = node.children[index - 1]
    child.right = node.children[index + 1]
  })
}

// TODO manage directly the tree

export const beautify = (tree: Tree): Tree => {
  return tree
}

// if (block.lineBreak) {
//     currentNode.children = [
//       {
//         ...lineBreak,
//         parent: currentNode
//       }
//     ]
//     setLeftAndRight(currentNode)
//   }

// if (block.lineBreak) {
//     currentNode.children = [
//       ...(currentNode.children ?? []),
//       {
//         ...lineBreak,
//         parent: currentNode
//       }
//     ]
//     setLeftAndRight(currentNode)
//   }
