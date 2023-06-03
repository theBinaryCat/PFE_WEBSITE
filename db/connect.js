const oracledb = require('oracledb');
const config = require('./config');
let pool;
async function connect() {
  try {
    //replace the connection info by config
    pool = await oracledb.createPool(config);
    console.log('Connected to Oracle database');
  } catch (error) {
    console.error(error);
  }
}

async function closePool() {
  try {
    await pool.close(10);
    console.log('Pool closed');
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  connect,
  closePool,
  getConnection: () => oracledb.getConnection(),
};
