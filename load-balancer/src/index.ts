import express from "express"

const app = express()

app.use(express.json())

const PORT = process.env.PORT || 8080

app.get("/health", (req, res) => {
  return res.status(200).send("OK")
})

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Response from server",
    port: PORT,
    timeStamp: Date.now()
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
