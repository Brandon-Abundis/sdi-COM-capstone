# sdi-COM-capstone

# App start-up

- $`docker compose up`
- This should run the whole thing, takes 15 seconds for cold starting the docker containers and knex migrations to work correctly.
- This runs the vite react app, knex migrations and seeding, and database creation...

# Client instruction\

- $`cd client`
  - $`npm install ` add packages for front end devs

# Server instruction

- $`cd server`
  - $`npm install express knex pg nodemon cors bcrypt`
  - $`npm install --save-dev @faker-js/faker`
