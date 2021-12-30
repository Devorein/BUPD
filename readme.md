<div align="center"> <h1>BUPD</h1> </div>
<div align="center"><b>A modern fullstack police application for BUPD</b></div>

</br>

<p align="center">
  <a href="https://github.com/Devorein/bupd/actions?query=Build"><img src="https://github.com/devorein/bupd/workflows/Build/badge.svg"/></a>
  <a href="https://github.com/Devorein/bupd/actions?query=Deploy"><img src="https://github.com/devorein/bupd/workflows/Deploy/badge.svg"/></a>
  <a href="https://app.codecov.io/gh/Devorein/bupd/branch/master"><img src="https://img.shields.io/codecov/c/github/devorein/bupd?color=blue"/></a>
</p>

- [Packages](#packages)
- [Steps](#steps)
  - [Environment Variables](#environment-variables)
- [Workflow](#workflow)
- [Deployments](#deployments)
- [Contributors](#contributors)

## Packages

This monorepo contains the following packages:-

- **`@bupd/client`** [Github](https://github.com/Devorein/bupd/tree/staging/packages/client): Next.js client package for BUPD
- **`@bupd/seeder`** [Github](https://github.com/Devorein/bupd/tree/staging/packages/seeder): Database seeder package for BUPD
- **`@bupd/server`** [Github](https://github.com/Devorein/bupd/tree/staging/packages/server) : Node.js Express server package for BUPD
- **`@bupd/types`** [Github](https://github.com/Devorein/bupd/tree/staging/packages/types) : Typescript type definition package for BUPD
- **`@bupd/validation`** [Github](https://github.com/Devorein/bupd/tree/staging/packages/validation) : Payload validation package for BUPD

## Steps

1. Run `npm install` to install shared dependencies
2. Run `npm run bootstrap` to install package dependencies and symlink binaries
3. Run `npm run build` to build all packages except the client using `typescript`
4. Run `npm run lint` to lint all packages using `eslint`
5. Run `npm run test` to run tests for all packages using `jest`

### Environment Variables

Before proceeding further please make sure you create the `.env` files

1. Create a `.env` **folder** in root directory
2. Create two files `seeder.env` and `.env` there
3. Inside `seeder.env` store these variables
   1. `ADMIN_PASSWORD`: Password of admin user
   2. `ADMIN_EMAIL`: Email of admin user
4. Inside `.env` store these variables
   1. `DATABASE_PASSWORD`: Mysql database password
   2. `DATABASE_USER`: Mysql Database user
   3. `DATABASE_HOST`: Mysql database host
   4. `DATABASE_NAME`: Mysql database name
   5. `SERVER_PORT`: Express server port
   6. `PASSWORD_SALT`: Password salt used when hashing
   7. `JWT_SECRET`: Jwt secret

A sample `.env` directory

![Sample env directory]("./../public/env_dir.png)

## Workflow

We tried to maintain a specific git workflow in this project.

1. Only repository owner has push access to `prod` and `staging` branches
2. Every member must create a branch from `staging` to work on their tasks
3. Once they've completed their task they push to the same remote branch.
4. From there they need to create a PR to the `staging` branch and add other members to review it
5. Two github workflows will run when a PR is sent to `staging` branch
   1. First workflow lints, builds and tests the code
   2. Second workflow creates a preview deployment to vercel
6. If the reviewer leaves any comments to be further resolved, the member must resolve those.
7. Once everything's been resolved, the reviewer will merge the PR to `staging` branch.
8. After an accumulation of commits to `staging` branch, the owner will create a PR from `staging` to `prod` branch
9. This will trigger one github workflow
   1. Automated server deployment to our `digitalocean droplet`
   2. Automated client deployment to our `vercel` project.

## Deployments

- `server`: Our [server](`https://api.bupd.xyz`) is deployed on a digitalocean droplet
- `client`: Our [client](`https://bupd.xyz`) is deployed on a vercel hobby plan project

**NOTE**: We are hosting our database on the same droplet as the server

## Contributors

1.  Safwan Shaheer [devorein](https://github.com/Devorein) Server, Client, Devops, System Design, Documentation, ER & Schema Design
2.  Zayed Humayun [abystoma](https://github.com/abystoma) Server, Testing, Documentation, ER & Schema Design
3.  Rafid Hamid [xImouto](https://github.com/xImouto) Server, Testing, Documentation, ER & Schema Design
4.  Rakinul Haque [rakinulhaque](https://github.com/rakinulhaque) ER & Schema Design, Documentation
5.  Abrar Awsaf [ShababKabab](https://github.com/ShababKabab) ER & Schema Design, Documentation
