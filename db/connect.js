const oracledb = require('oracledb')
const config = require('./config')

async function connect() {
  try {
    //replace the connection info by config
    await oracledb.createPool(config)
    console.log('Connected to Oracle database')
  } catch (error) {
    console.error(error)
  }
}

async function close() {
  try {
    await oracledb.getPool().close()
    console.log('Disconnected from Oracle database')
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  connect,
  close,
  getConnection: () => oracledb.getConnection()
}