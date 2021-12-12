import dotenv from "dotenv";
import express from "express";
import mysql from "mysql";
import path from "path";
import RootRouter from "./routes";

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
app.use(express.json());

app.use('/v1', RootRouter);

const PORT = process.env.SERVER_PORT;

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