# fittfu-fantasy-backend
Server for FITTFU Fantasy.  Exposes a RESTful API.  Uses token authorization for most requests.  See docs for details.
## API Documentation
* Base URL: localhost:8000
* POST parameters should be encoded as JSON.  All endpoints will return 400 on JSON parse failure.
* Requests to api/* **must** include x-token={token} in the request header.  A missing or invalid token will result in a 400 error.
### Users
#### `POST` /register
*Registers a new user.*

Parameter | Type   | Required
:-------: | :----: | :-----:
firstName | String | Yes
lastName  | String | Yes
email     | String | Yes
password  | String | Yes

Code  | Response       | Error
:---: | :------------: | :----:
200   | None           | None
400   | {message}      | Hash failure
400   | {message}      | Unknown

#### `POST` /login
*Obtains a token.  The token is valid for 24 hours.*

Parameter | Type   | Required
:-------: | :----: | :-----:
email     | String | Yes
password  | String | Yes

Code  | Response       | Error
:---: | :------------: | :----:
200   | {token}        | None
400   | {message}      | Password incomparable
400   | {message}      | Password incorrect
400   | {message}      | Email not found
400   | {message}      | Unknown

### Leagues
#### `GET` /api/leagues
#### `GET` /api/leagues/{id}
#### `GET` /api/leagues/{id}/teams
#### `GET` /api/leagues/{id}/weeks
#### `GET` /api/leagues/{id}/weeks/current

### Weeks
#### `GET` /api/weeks/{id}
#### `GET` /api/weeks/{id}/games
#### `GET` /api/weeks/{id}/lineups
#### `GET` /api/weeks/{id}/lineups/me

### Games 
#### `GET` /api/games/{id}

### Lineups
#### `GET` /api/lineups/{id}
#### `GET` /api/lineups/{id}/players
#### `PUT` /api/lineups/{id}/players/{id}
#### `DELETE` /api/lineups/{id}/players/{id}




