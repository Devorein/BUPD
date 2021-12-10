import express from "express";
import mysql from "mysql";

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
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