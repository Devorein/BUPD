# `@bupd/seeder`

Database seeder package for BUPD

## Stack

1. `axios`: Package to make http requests
2. `mysql2`: Node.js Mysql native driver
3. `faker`: Package to generate random data
4. `colors`: Package for coloured terminal outputs

## Scripts

1. `npm run create-db <db_name>`: Creates `<db_name>` if it doesn't exist and otherwise drops it and populates with tables
2. `npm run seeder`: Creates dummy data for the database
