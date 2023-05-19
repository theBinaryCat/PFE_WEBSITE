require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
  poolMax: 20,
  poolMin: 2,
};

module.exports = config;
