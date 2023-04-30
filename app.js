const express = require('express')
const { connect, close } = require('./db/connect')
const routes = require('./routes/test')

const app = express()

app.use(express.json())
app.use('/api', routes)

connect()
//set the view engine for our application to EJS (rendering dynamic HTML to client requests)
app.set('view-engine', 'ejs')
app.get('/', (req, res) => {
  res.render('index.ejs', { name: 'test' })
})

app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.post('/login', (req, res) => {

})

app.get('/register', (req, res) => {
  res.render('register.ejs')
})

app.post('/register', (req, res) => {
  
})

// Start the server
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

// Gracefully shutdown the server on interrupt signals
process.on('SIGINT', async () => {
  console.log('Shutting down server gracefully')
  await close()
  process.exit(0)
})