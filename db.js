require("dotenv").config();
const { Pool } = require("pg");
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: process.env.db_password,
  port: 5432,
  database: "test",
});

module.exports = pool;
