import express from "express"
import { initDatabases } from "./db/init"
import { getDB } from "./services/dbClient"
import { getNode, nodes } from "./services/node"
import { addNode, buildRing, getRingNode, rings } from "./services/ring"
import { getHash } from "./services/hash"

const server = express()

server.use(express.json())

initDatabases()

const users = []

for (let i = 1; i <= 10000; i++) {
  users.push(`user${i}`)
}

// Modulo Hashing implementation

// const oldMapping: Record<string, string> = {}

// users.forEach((user) => {
//   oldMapping[user] = getNode(user)
// })

// const distribution: Record<string, number> = {}

// users.forEach((user) => {
//   const node = getNode(user)
//   distribution[node] = (distribution[node] || 0) + 1
// })

// nodes.push("node5")

// const newMapping: Record<string, string> = {};

// users.forEach(user => {
//   newMapping[user] = getNode(user);
// });

// let moved = 0;

// users.forEach((user) => {
//   if (oldMapping[user] !== newMapping[user]) {
//     moved++
//   }
// })

// console.log("Moved:", moved, "/", users.length);

// Consistent Hashing implementation

buildRing()

const oldMapping: Record<string, string> = {}

users.forEach((user) => {
  // console.log(`${user} -> ${getRingNode(user)}`)
  oldMapping[user] = getRingNode(user)
})

addNode("node5")

rings.sort((a, b) => a.hash - b.hash)

const newMapping: Record<string, string> = {}

users.forEach((user) => {
  newMapping[user] = getRingNode(user)
})

let moved = 0

users.forEach((user) => {
  if (oldMapping[user] !== newMapping[user]) {
    moved++
  }
})

console.log(`Moved: ${moved} / ${users.length}`)

const distribution: Record<string, number> = {}

users.forEach((user) => {
  const node = getRingNode(user)
  distribution[node] = (distribution[node] || 0) + 1
})

console.log("Distribution: ", distribution)

server.get("/", (req, res) => {
  res.status(200).json({
    message: "Server running successfully",
    success: true
  })
})

server.listen(8080, () => {
  console.log(`Server runnning on port 8080`)
})
