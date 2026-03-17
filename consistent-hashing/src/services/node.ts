import { getHash, getModuloHash } from "./hash"

const nodes = ["node1", "node2", "node3", "node4"]

function getNode(id: string): string {
  const index = getModuloHash(id, nodes.length)
  return nodes[index]!
}

export {nodes, getNode}
