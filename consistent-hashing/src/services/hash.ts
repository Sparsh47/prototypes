import crypto from "crypto"

function getModuloHash(input: string, dbLen: number): number {
  const hash = crypto.createHash("sha256").update(input).digest("hex");

  const num = parseInt(hash.substring(0, 12), 16);

  return num % dbLen;
}

function getHash(input: string): number {
  const hash = crypto.createHash("sha256").update(input).digest("hex");

  const num = parseInt(hash.substring(0, 12), 16);

  return num;
}

export {getModuloHash, getHash}
