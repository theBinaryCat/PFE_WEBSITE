const express = require('express')
const { connect, close, getConnection } = require('./db/connect')
const routes = require('./routes/test')
const app = express()
//hash and compare passwords
const bcrypt = require('bcrypt')


app.use(express.json())
app.use('/api', routes)

connect()
//set the view engine for our application to EJS (rendering dynamic HTML to client requests)
app.set('view-engine', 'ejs')

//Take data from the forms and build access to them inside our request variable in post method
app.use(express.urlencoded({ extended: false }))

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

app.post('/register', async (req, res) => {
  try {
    //hash the password of the new user
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    //test
    console.log('hashedPassword:', hashedPassword);
    console.log('req.body.password:', req.body.password);
    console.log(Date.now())
    console.log(req.body.name)
    console.log(req.body.email)
    console.log(req.body.password)
    const connection = await getConnection()
    //store the new user in our database
    await connection.execute(
      `INSERT INTO users (id, name, email, password) VALUES (${Date.now()}, '${req.body.name}', '${req.body.email}', '${hashedPassword}')`
    );
    await connection.execute(
      `commit`
    );
    await close();
    //if the registration is succefull, redirect to login page
    res.redirect('/login')
  } catch (e){
    console.error(e)
    //if the registration is failes, redirect to registration page
    res.redirect('/register')
  }
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