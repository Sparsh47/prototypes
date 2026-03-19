import { getHash } from "./hash";
import { nodes } from "./node";

const VIRTUAL_NODES = 100;

type RingNode = {
  name: string;
  virtualId: string;
  hash: number;
}

export const rings: RingNode[] = []

export function buildRing() {

  nodes.forEach(node =>
    {
    for (let i = 0; i < VIRTUAL_NODES; i++) {
      const virtualId = `${node}#${i}`
      rings.push({name: node, virtualId, hash: getHash(virtualId)})
      }
    }
  )

  rings.sort((a, b) => a.hash - b.hash);
}

export function getRingNode(id: string): string {
  const hash = getHash(id)

  for (let i = 0; i < rings.length; i++) {
    if (hash <= rings[i]!.hash) {
      return rings[i]!.name
    }
  }

  return rings[0]!.name
}

export function addNode(nodeName: string) {
  for (let i = 0; i < VIRTUAL_NODES; i++) {
    const virtualKey = `${nodeName}#${i}`;

    rings.push({
      name: nodeName,
      virtualId: virtualKey,
      hash: getHash(virtualKey)
    })
  }

  rings.sort((a, b)=>a.hash-b.hash)
}
