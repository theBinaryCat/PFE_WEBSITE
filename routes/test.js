const express = require('express')
const router = express.Router()
const { getConnection } = require('../db/connect')

router.get('/dashboard', async (req, res) => {
  try {
    const connection = await getConnection()
    const result = await connection.execute('SELECT * FROM DIM_DATE')
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching data' })
  }
})

module.exports = router