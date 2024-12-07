const express = require("express")
const bodyParser = require("body-parser")
const nodemailer = require("nodemailer")
const app = express()

// Middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public")) // Serve HTML from the public folder

// Store participants in memory (use a database in production)
const participants = []

// Route to handle form submission
app.post("/submit", (req, res) => {
  const { name, wish } = req.body
  participants.push({ name, wish })
  res.send(`<h1>Thanks for joining Secret Santa, ${name}!</h1>`)
})

// Route to assign Secret Santas (admin-only logic here)
app.get("/assign", (req, res) => {
  if (participants.length < 2) {
    return res.send("Not enough participants to assign Secret Santas!")
  }

  const shuffled = [...participants].sort(() => Math.random() - 0.5)
  const assignments = shuffled.map((_, i) => ({
    santa: shuffled[i].name,
    recipient: shuffled[(i + 1) % shuffled.length].name,
  }))

  res.send(assignments.map((a) => `${a.santa} → ${a.recipient}`).join("<br>"))
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
)
