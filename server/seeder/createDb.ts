// type "node ./dist/seeder/createDb in terminal and uncomment the last line" to make databases
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import path from 'path';

dotenv.config({
	path: path.join(__dirname, '.env'),
});

dotenv.config({
	path: path.join(__dirname, 'seeder.env'),
});

export default async function createDb(dbName: string) {
	let connection: mysql.Connection | null = null;
	try {
		connection = await mysql.createConnection({
			host: process.env.DATABASE_HOST,
			user: process.env.DATABASE_USER,
			password: process.env.DATABASE_PASSWORD,
		});

		console.log('Connected!');

		// change db name here

		await connection.query(`create database ${dbName};`);

		await connection.query(`use ${dbName};`);

		let query = `CREATE TABLE Police (
        nid int NOT NULL,
        name varchar(255) NOT NULL,
        password varchar(255) NOT NULL,
        email varchar(50) NOT NULL,
        address varchar(250),
        designation varchar(250),
        phone varchar(25),
        -- Need to use backtics around rank as its a reserved keyword in MySQL 8
        \`rank\` varchar(100) NOT NULL,
        UNIQUE (email),
        PRIMARY KEY (nid)
      );`;
		await connection.query(query);

		query = `CREATE TABLE Admin (
        id MEDIUMINT NOT NULL AUTO_INCREMENT,
        email varchar(50) NOT NULL,
        password varchar(255) NOT NULL,
        UNIQUE (email),
        PRIMARY KEY (id)
      );`;
		await connection.query(query);

		query = `CREATE TABLE Casefile (
            case_no INT NOT NULL AUTO_INCREMENT,
            status VARCHAR(10),
            location VARCHAR(250) NOT NULL,
            priority VARCHAR(10),
            time DATETIME NOT NULL,
            police_nid INT NOT NULL,
            FOREIGN KEY (police_nid) REFERENCES Police(nid),
            PRIMARY KEY (case_no)
            );`;
		await connection.query(query);

		query = `CREATE TABLE Crime_Category (
        category VARCHAR(50) NOT NULL,
        case_no INT NOT NULL,
        PRIMARY KEY(category, case_no),
        FOREIGN KEY (case_no) REFERENCES Casefile(case_no)
        );`;
		await connection.query(query);

		query = `CREATE TABLE Crime_Weapon (
        weapon VARCHAR(50) NOT NULL,
        case_no INT NOT NULL,
        PRIMARY KEY(weapon, case_no),
        FOREIGN KEY (case_no) REFERENCES Casefile(case_no)
        );`;
		await connection.query(query);

		query = `CREATE TABLE Criminal (
        name VARCHAR(50) NOT NULL,
        criminal_id INT NOT NULL AUTO_INCREMENT,
        photo VARCHAR(255),
        PRIMARY KEY (criminal_id)
        );`;
		await connection.query(query);

		query = `CREATE TABLE Victim (
        case_no INT NOT NULL,
        name VARCHAR(50),
        address VARCHAR(255),
        age INT,
        phone_no VARCHAR(50),
        description VARCHAR(500),
        FOREIGN KEY (case_no) REFERENCES Casefile(case_no),
        PRIMARY KEY (case_no, name)
        );`;
		await connection.query(query);

		query = `CREATE TABLE Casefile_Criminal (
        case_no INT NOT NULL,
        criminal_id INT NOT NULL,
        FOREIGN KEY (case_no) REFERENCES Casefile(case_no),
        FOREIGN KEY (criminal_id) REFERENCES Criminal(criminal_id ),
        PRIMARY KEY (case_no, criminal_id)
        );`;
		await connection.query(query);

		query = `CREATE TABLE Access (
        access_id INT NOT NULL AUTO_INCREMENT,
        permission VARCHAR(10) NOT NULL,
        approved BOOLEAN NOT NULL,
        police_nid INT NOT NULL,
        type VARCHAR(10) NOT NULL,
        criminal_id INT,
        case_no INT,
        admin_id MEDIUMINT,
        FOREIGN KEY (case_no) REFERENCES Casefile(case_no),
        FOREIGN KEY (criminal_id) REFERENCES Criminal(criminal_id),
        FOREIGN KEY (admin_id) REFERENCES Admin(id),
        PRIMARY KEY (access_id)
        );`;
		await connection.query(query);

		query = `INSERT INTO Admin(email, password) values("${process.env.ADMIN_EMAIL!}", "${process.env
			.ADMIN_DB_PASS!}");`;
		await connection.query(query);
		console.log('All queries should be executed successfully now., closing connection...');
		await connection.end();
	} catch (err) {
		console.log(err.message);
		await connection?.end();
	}
}
// createDb('test'); //rode
