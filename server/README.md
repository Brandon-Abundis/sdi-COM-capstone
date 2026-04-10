# Server endpoint instruction

base endpoint, no data from here

- http://localhost:8080 (GET)

## Users

users endpoint, you can get all users info from here

- http://localhost:8080/users (GET)

user endpoint, you can get a specific user info from here by passing user id

- http://localhost:8080/users/id/:id (GET)

user endpoint, you can post a specific user info from here by passing user id and user data you want to modify(you cannot change password and rival_ids here)

- http://localhost:8080/users/id/:id (POST)

user endpoint, you can change a specific user password from here by passing user id and user new password you want

- http://localhost:8080/users/password/id/:id (POST)

user endpoint, you can add a specific user rival from here by passing user id and rival_id you want to add

- http://localhost:8080/users/rival/id/:id (POST)

user endpoint, you can remove a specific user rival from here by passing user id and rival_id you want to remove

- http://localhost:8080/users/rival/remove/id/:id (POST)

user endpoint, you can get all groups info associated to a user by passing user id

- http://localhost:8080/users/groups/id/:id (GET)

user endpoint, you can get all user goal info associated to a user by passing user id

- http://localhost:8080/users/user_goals/id/:id (GET)

user endpoint, you can update user goal info by passing in user_goal id to the endpoint and new info as in the body

- http://localhost:8080/users/user_goals/update/id/:id (POST)

user endpoint, you can create new user goal by passing in new info in the body (this endpoint requires user_id to be passed in in the body)

- http://localhost:8080/users/user_goals/create/ (POST)

user endpoint, you can get all user workout info associated to a user by passing user id

- http://localhost:8080/users/user_workouts/id/:id (GET)

user endpoint, you can update user workout info by passing in user_goal id to the endpoint and new info as in the body

- http://localhost:8080/users/user_workouts/update/id/:id (POST)

user endpoint, you can create new user workout by passing in new info in the body (this endpoint requires user_id to be passed in in the body)

- http://localhost:8080/users/user_workouts/create/ (POST)

user endpoint, you can get all user event info associated to a user by passing user id

- http://localhost:8080/users/user_events/id/:id (GET)

user endpoint, you can create a specific user events from here by passing
{name, date, time, user_id}

- http://localhost:8080/users/id/:id (POST)

## Scores

scores endpoint, you can get all scores info

- http://localhost:8080/scores (GET)

scores endpoint, you can get all user scores info associated to a user by passing user id

- http://localhost:8080/scores/id/:id (GET)

## Groups

groups endpoint, you can get all groups info from here

- http://localhost:8080/groups/ (GET)

group endpoint, you can get a specific group info from here by passing group id

- http://localhost:8080/groups/id/:id (GET)

group endpoint, you can update group info by passing in group id to the endpoint and new info in the body

- http://localhost:8080/groups/id/:id (POST)

group endpoint, you can get specific group goals from here by passing group id

- http://localhost:8080/groups/group_goals/id/:id (GET)

group endpoint, you can update group goals info by passing in group_goals id to the endpoint and new info as in the body

- http://localhost:8080/groups/groups_goals/update/id/:id (POST)

user endpoint, you can create new user goal by passing in new info in the body (this endpoint requires group_id to be passed in in the body)

- http://localhost:8080/groups/groups_goals/create/ (POST)

group endpoint, you can get specific group workouts from here by passing group id

- http://localhost:8080/groups/group_workouts/id/:id (GET)

group endpoint, you can update group workout info by passing in group_workouts id to the endpoint and new info as in the body

- http://localhost:8080/groups/groups_workouts/update/id/:id (POST)

user endpoint, you can create new user workout by passing in new info in the body (this endpoint requires group_id to be passed in in the body)

- http://localhost:8080/groups/groups_workouts/create/ (POST)

group endpoint, you can get specific group events from here by passing group id

- http://localhost:8080/groups/group_events/id/:id (GET)

## Group endpoints created by James(ask him questions about it)

- http://localhost:8080/groups (POST)
- http://localhost:8080/groups/:id/join (PATCH)
- http://localhost:8080/groups/:id/leave (PATCH)
- http://localhost:8080/groups/:id/invite (PATCH)

## Auth

account registeration endpoint, you can post new user here

- http://localhost:8080/auth/register (POST)

account login endpoint, you can login to a user using email and password post here

- http://localhost:8080/auth/login (POST)

## Global_Events

global endpoint, you can get all global event info

- http://localhost:8080/global (GET)

global endpoint, you can update global evnet info by passing in global_events id to the endpoint and new info as in the body

- http://localhost:8080/global/update/id/:id (POST)

global endpoint, you can create new global event by passing in new info in the body (this endpoint requires user_id to be passed in in the body)

- http://localhost:8080/global/create (POST)

## Logs

security log endpoint, you can get all logs from here

- http://localhost:8080/logs (GET)
