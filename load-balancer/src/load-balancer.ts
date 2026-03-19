import express from "express"

const app = express()

const PORT = 4000

app.use(express.json())

let currentIndex = 0

const servers: string[] = [
  "http://localhost:8081",
  "http://localhost:8082",
  "http://localhost:8083",
]

const getNextServer = (): string => {
  const server = servers[currentIndex]!
  currentIndex = (currentIndex + 1) % servers.length
  return server
}

app.get("/", async (req, res) => {
  try {
    const server = getNextServer();

    const response = await fetch(server);
    const data = await response.json();

    res.json({
      routedTo: server,
      data
    });
  } catch (err) {
    res.status(500).json({ error: "Server failed" });
  }
})

app.listen(PORT, () => {
  console.log("Load balancer is running on port 4000")
})
