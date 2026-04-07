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

# Server endpoint instruction

base endpoint, no data from here

- http://localhost:8080

users endpoint, you can get all users info from here

- http://localhost:8080/users

user endpoint, you can get a specific user info from here by passing user id

- http://localhost:8080/users/id/:id

user endpoint, you can get all groups info associated to a user by passing user id

- http://localhost:8080/users/groups/id/:id

user endpoint, you can get all user goal info associated to a user by passing user id

- http://localhost:8080/users/user_goals/id/:id

user endpoint, you can get all user workout info associated to a user by passing user id

- http://localhost:8080/users/user_workouts/id/:id

user endpoint, you can get all user event info associated to a user by passing user id

- http://localhost:8080/users/user_events/id/:id

user endpoint, you can get all user scores info associated to a user by passing user id

- http://localhost:8080/users/scores/id/:id
