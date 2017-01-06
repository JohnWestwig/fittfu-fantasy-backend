# fittfu-fantasy-backend
Server for FITTFU Fantasy.  Exposes a RESTful API.  Uses token authorization for most requests.  See docs for details.
## API Documentation
* Base URL: **localhost:8000**
* POST parameters should be encoded as JSON.  All endpoints will return 400 on JSON parse failure.
* Requests to api/* **must** include x-token={token} in the request header.  A missing or invalid token will result in a 400 error.

### Users
#### [`POST` /register](#register)

#### `POST` /login

### Leagues

#### `GET` /api/leagues


#### `GET` /api/leagues/{id}
#### `POST`/api/leagues/{id}/join
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




