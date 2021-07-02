const { Pool } = require('pg');

const pool = new Pool({
  user: "ubuntu",
  password:"stinkoman6366",
  host:"ec2-34-219-144-24.us-west-2.compute.amazonaws.com", //sdc-reviews_database_1
  port:5432,
  database:"review_api"
});

/* pool.query("SELECT * FROM review limit(20)", (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log(res);
  }
}) */

module.exports = {
  pool
}
/* client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
  console.log(err ? err.stack : res.rows[0].message) // Hello World!
  client.end()
}) */


/* const { Client } = require('pg')
const client = new Client()
client.connect()
client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
  console.log(err ? err.stack : res.rows[0].message) // Hello World!
  client.end()
}) */









/* COPY characteristics(id, characteristic_id, review_id, value)
FROM '/home/bongobomba/hackreactor/SEC/Data/Raw/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE IF NOT EXISTS products(
  id SERIAL NOT NULL PRIMARY KEY,
  product_name VARCHAR(50),
  slogan text,
  product_description text,
  category VARCHAR(50),
  default_price VARCHAR(50)
);
COPY products(id, product_name, slogan, product_description, category, default_price)
FROM '/home/bongobomba/hackreactor/SEC/Data/Raw/product.csv'
DELIMITER ','
CSV HEADER; */