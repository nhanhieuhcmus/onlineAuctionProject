const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
  connectionLimit: 50,
  host: 'localhost',
  user: 'root',
  database: 'ql_sdg'
});

const mysql_query = util.promisify(pool.query).bind(pool);

module.exports = {
  load: sql => mysql_query(sql),
  add: (tableName, entity) => mysql_query(`insert into ${tableName} set ?`, entity),
  addoffer: (tableName, entity) => mysql_query(`insert into ${tableName}(product_id, user_id, price, time) 
  value(${entity.product_id}, ${entity.user_id}, ${entity.price}, NOW())`)
}; 


// pool.getConnection(function(err, connection) {
//       if (err) throw err; // not connected!
     
//       // Use the connection
//       connection.query('SELECT * FROM category where id = 1', function (error, results, fields) {
//         // When done with the connection, release it.
//         connection.release();
     
//         console.log(results);
  
//         // Handle error after the release.
//         if (error) throw error;
     
//         // Don't use the connection here, it has been returned to the pool.
//   });
//   });