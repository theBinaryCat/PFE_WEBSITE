const { getConnection, connect, closePool } = require('../db/connect');
const { queryCA1, queryCA2, queryCA3 } = require('../queries');

const dashboard = async (req, res) => {
  const user = await req.user;
  console.log('the user name: ', user.name);
  res.render('index.ejs', { name: user.name });
};

const dashboard_CA = async (req, res) => {
  const user = await req.user;
  console.log('the user name: ', user.name);
  res.render('dashboards/production.ca.ejs', { name: user.name });
};

// Query the database and fetch data
const fetchDataCA = async (req, res) => {
  try {
    await connect();
    const connection = await getConnection();
    //fetch the data from the database
    const result1 = await connection.execute(queryCA1);
    const result2 = await connection.execute(queryCA2);
    const result3 = await connection.execute(queryCA3);
    await connection.close();
    const data1 = {
      labels: result1.rows.map((row) => row[0]),
      datasets: [
        {
          data: result1.rows.map((row) => row[1]),
        },
      ],
    };
    const data2 = {
      labels: result2.rows.map((row) => row[0]),
      datasets: [
        {
          data: result2.rows.map((row) => row[1]),
        },
      ],
    };
    const data3 = {
      labels: result3.rows.map((row) => row[0]),
      datasets: [
        {
          data: result3.rows.map((row) => row[1]),
        },
      ],
    };
    const data = {
      data1: data1,
      data2: data2,
      data3: data3,
    };
    console.log('fetch data:', data);
    res.json(data);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { dashboard, dashboard_CA, fetchDataCA };
