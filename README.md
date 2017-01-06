# fittfu-fantasy-backend
Server for FITTFU Fantasy.  Exposes a RESTful API.  Uses token authorization for most requests.  See docs for details.
## API Documentation
* Base URL: **localhost:8000**
* Parameters are either encoded in JSON in the request body, or, when noted, as query string parameters.  All endpoints will return 400 on JSON parse failure.
* Requests to api/* **must** include x-token={token} in the request header.  A missing or invalid token will result in a 400 error.
* Errors are returned in JSON format along with an appropriate HTTP status code.  Each error contains a unique error code, generic message and more specific description.

### Users
#### [`POST` /register](#register)
Registers a new user.  Email must be of a valid format and not already in use.  All fields must be non-empty
Parameters
| Parameter     | Method   | Required? |
| :-----------: | :-------:| :--------:|
| email         | Body     | Yes       |
| password      | Body     | Yes       |
| firstName     | Body     | Yes       |
| lastName      | Body     | Yes       |

Responses
sample call?

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




