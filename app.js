const express = require('express')
const { connect, close } = require('./db/connect')
const routes = require('./routes/test')

const app = express()

app.use(express.json())
app.use('/api', routes)

connect()

// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

// Gracefully shutdown the server on interrupt signals
process.on('SIGINT', async () => {
  console.log('Shutting down server gracefully')
  await close()
  process.exit(0)
})