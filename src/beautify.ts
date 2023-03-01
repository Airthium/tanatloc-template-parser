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

const traverseTree = (tree: Node): void => {
  if (!tree.children) return

  for (const child of tree.children) {
    switch (child.family) {
      case 'blocks':
        break
      case 'operators':
        break
      case 'comment':
        break
      case 'string':
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
