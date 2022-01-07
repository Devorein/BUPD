import argon2 from 'argon2';
import colors from 'colors';
import mysql from 'mysql2/promise';

export default async function createDb(dbName: string) {
	let connection: mysql.Connection | null = null;
	try {
		connection = await mysql.createConnection({
			host: process.env.DATABASE_HOST,
			user: process.env.DATABASE_USER,
			password: process.env.DATABASE_PASSWORD,
		});

		if (!dbName) {
			throw new Error(colors.bold.red('Database name is required'));
		}
		console.log(colors.bold.blue('Connected!'));

		try {
			console.log(colors.bold.blue(`Creating database ${dbName}`));
			await connection.query(`create database ${dbName};`);
		} catch (_) {
			console.log(
				colors.bold.blue(`Database ${dbName} already exists, deleting and creating again`)
			);
			await connection.query(`DROP database ${dbName}`);
			await connection.query(`create database ${dbName};`);
		}

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
            PRIMARY KEY (nid)
            );`;
		await connection.query(query);
		console.log(colors.bold.blue(`Created police table`));

		query = `CREATE TABLE Admin (
            id MEDIUMINT NOT NULL AUTO_INCREMENT,
            email varchar(50) NOT NULL,
            password varchar(255) NOT NULL,
            UNIQUE (email),
            PRIMARY KEY (id)
            );`;
		await connection.query(query);
		console.log(colors.bold.blue(`Created admin table`));

		query = `CREATE TABLE Casefile (
            case_no INT NOT NULL AUTO_INCREMENT,
            status VARCHAR(10),
            location VARCHAR(250) NOT NULL,
            priority TINYINT NOT NULL,
            time DATETIME NOT NULL,
            police_nid INT,
            FOREIGN KEY (police_nid) 
                REFERENCES Police(nid) ON DELETE SET NULL,
            PRIMARY KEY (case_no)
            );`;
		await connection.query(query);
		console.log(colors.bold.blue(`Created casefile table`));

		query = `CREATE TABLE Crime_Category (
            category VARCHAR(50) NOT NULL,
            case_no INT NOT NULL,
            PRIMARY KEY(category, case_no),
            FOREIGN KEY (case_no) 
                REFERENCES Casefile(case_no) ON DELETE CASCADE
            );`;
		await connection.query(query);
		console.log(colors.bold.blue(`Created crime_category table`));

		query = `CREATE TABLE Crime_Weapon (
            weapon VARCHAR(50) NOT NULL,
            case_no INT NOT NULL,
            PRIMARY KEY(weapon, case_no),
            FOREIGN KEY (case_no) 
                REFERENCES Casefile(case_no) ON DELETE CASCADE
            );`;
		await connection.query(query);
		console.log(colors.bold.blue(`Created crime_weapon table`));

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
            FOREIGN KEY (case_no)
                REFERENCES Casefile(case_no) ON DELETE CASCADE,
            PRIMARY KEY (case_no, name)
            );`;
		await connection.query(query);
		console.log(colors.bold.blue(`Created victim table`));

		query = `CREATE TABLE Casefile_Criminal (
            case_no INT NOT NULL,
            criminal_id INT NOT NULL,
            FOREIGN KEY (case_no)
                REFERENCES Casefile(case_no) ON DELETE CASCADE,
            FOREIGN KEY (criminal_id) 
                REFERENCES Criminal(criminal_id ) ON DELETE CASCADE,
            PRIMARY KEY (case_no, criminal_id)
            );`;
		await connection.query(query);
		console.log(colors.bold.blue(`Created casefile_criminal table`));

		query = `CREATE TABLE Access (
            access_id INT NOT NULL AUTO_INCREMENT,
            permission VARCHAR(10) NOT NULL,
            approved TINYINT NOT NULL,
            police_nid INT NOT NULL,
            type VARCHAR(10) NOT NULL,
            criminal_id INT,
            case_no INT,
            admin_id MEDIUMINT,
            FOREIGN KEY (case_no)
                REFERENCES Casefile(case_no) ON DELETE CASCADE,
            FOREIGN KEY (criminal_id)
              REFERENCES Criminal(criminal_id) ON DELETE CASCADE,
            FOREIGN KEY (admin_id)
                REFERENCES Admin(id),
            PRIMARY KEY (access_id)
            );`;
		await connection.query(query);
		console.log(colors.bold.blue(`Created access table`));

		const hashedAdminPassword = await argon2.hash(process.env.ADMIN_PASSWORD!, {
			hashLength: 100,
			timeCost: 5,
			salt: Buffer.from(process.env.PASSWORD_SALT!, 'utf-8'),
		});

		query = `INSERT INTO Admin(email, password) values("${process.env
			.ADMIN_EMAIL!}", "${hashedAdminPassword!}");`;
		await connection.query(query);
		console.log(colors.bold.blue(`Inserted admin`));
		console.log('All queries should be executed successfully now., closing connection...');
		await connection.end();
	} catch (err) {
		console.log(err.message);
		await connection?.end();
	}
}
