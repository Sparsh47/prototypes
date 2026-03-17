import { getHash } from "./hash";
import { nodes } from "./node";

type RingNode = {
  name: string;
  hash: number;
}

export const rings: RingNode[] = []

export function buildRing() {
  nodes.forEach(node => (rings.push({name: node, hash: getHash(node)})))

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
