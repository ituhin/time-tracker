time tracker - test project

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Note

did not use any db and data is stored in memory, its just a test project, so restart will wipe out the data.

these endpoints are available

1. POST /users/login 
params - {
    "user_name": "somename",
    "password": "pass"
}
returns jwt-token which should be sent as "jwt" header in other api calls
any user_name with a dummy password will give you a token, there is no seeded user data inside.
added sample auth-middleware to parse the jwt-token header to user-name

note, as there is no user db user-name is used instead of standard uid


below these endpoints expects jwt header to get the user
2. POST /user-timer/start 
params - {
    "title": "hello world"
}
the title field i kept required here, lately had a thought about moving it to /stop instead of /start
returns timer object with an id

3. POST /user-timer/stop
no params required, it stops the running timer, and returns a the timer object

4. POST /user-timer/edit/{timer-id}
sample param - {
    "title": "some new title",
    "start_time": 1601401038,
    "end_time": 1601401039
}
all the fields are optional here
time fields are unix timestamp, can be displayed in any format as well
returns updated object

5. GET /user-timer/getAll

returns timer records sorted by start_time in descending order or recent first, 
also returns total-duration (running timer duration excluded, but can be included as well)

6. GET /user-timer/search?title={keyword}
returns those records where title is having the keyword, again sorted by start_time recent first
