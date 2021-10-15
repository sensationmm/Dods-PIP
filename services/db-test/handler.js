const Client = require('mariadb')
const { ipLookup, urlLookup } = require('./helpers')

const pool = Client.createPool({
  host: process.env.MARIA_DB_HOST,
  user: process.env.MARIA_DB_USERNAME,
  password: process.env.MARIA_DB_PASSWORD,
  database: process.env.MARIA_DB_DATABASE,
  connectionLimit: 5
});

module.exports.hello = async (event) => {
  console.log('env:', process.env)
  const [dbDnsResponse, dnsResponse] = await Promise.all([
    ipLookup(process.env.MARIA_DB_HOST),
    ipLookup('encrypted.google.com')
  ])

  console.log({ dnsResponse, dbDnsResponse })

  // -- Test if the Lambda can reach out "The Internet"
  // const url = 'https://encrypted.google.com'
  // const httpResponse = await urlLookup(url)

  let dbResponse
  let conn;
  try {
    // conn = await pool.getConnection();
    conn = Client.createConnection({
      host: process.env.MARIA_DB_HOST,
      user: process.env.MARIA_DB_USERNAME,
      password: process.env.MARIA_DB_PASSWORD,
      database: process.env.MARIA_DB_DATABASE
    })
    const dbRes = await conn.query('SELECT 1 as val');
    console.log(dbRes);
  } catch (e) {
      dbResponse = `ERROR: ${e.message}`
  } finally {
      if (conn) return (await conn).end //return conn.end();
  }

  return {
    message: 'Very much success!!!',
    dbResponse,
    dnsResponse,
    dbDnsResponse,
    // responseHeader: httpResponse,
    event
  }

  // async function asyncFunction() {
  //   let conn;
  //   try {
  //   conn = await pool.getConnection();
  //   const rows = await conn.query("SELECT 1 as val");
  //   console.log(rows); //[ {val: 1}, meta: ... ]
  //   const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
  //   console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
  
  //   } catch (err) {
  //   throw err;
  //   } finally {
  //   if (conn) return conn.end();
  //   }
  // }

  // return {
  //   statusCode: 200,
  //   body: JSON.stringify(
  //     {
  //       message: 'Go Serverless v1.0! Your function executed successfully!',
  //       input: event,
  //     },
  //     null,
  //     2
  //   ),
  // };

};
