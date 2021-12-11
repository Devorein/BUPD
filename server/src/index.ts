import dotenv from "dotenv";
import express from "express";
import mysql from "mysql";
import path from "path";

dotenv.config({
  path: path.join(__dirname, ".env") 
});

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: 'test'
});

const app = express();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  connection.connect((err) => {
    if (err) {
      console.error(`Error connecting to database\n${err.message}`)
    } else {
      console.log(`Connected to database`);
    }
  })
})