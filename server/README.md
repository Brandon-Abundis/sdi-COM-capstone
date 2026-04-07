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

groups endpoint, you can get all groups info from here

- http://localhost:8080/groups/

group endpoint, you can get a specific group info from here by passing group id

- http://localhost:8080/groups/id/:id

group endpoint, you can get specific group goals from here by passing group id

- http://localhost:8080/groups/group_goals/id/:id

group endpoint, you can get specific group workouts from here by passing group id

- http://localhost:8080/groups/group_workouts/id/:id

group endpoint, you can get specific group events from here by passing group id

- http://localhost:8080/groups/group_events/id/:id

security log endpoint, you can get all logs from here

- http://localhost:8080/logs

account registeration endpoint, you can post new user here

- http://localhost:8080/auth/register

account login endpoint, you can login to a user using email and password post here

- http://localhost:8080/auth/register
