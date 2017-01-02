# fittfu-fantasy-backend
Server for FITTFU Fantasy.  Exposes a RESTful API.  Uses token authorization for most requests.  See docs for details.
## API Documentation
Base URL: localhost:8000
### Users
#### `POST` /register
*Registers a new user*

Parameter | Type   | Required
:-------: | :----: | :-----:
firstName | String | **Yes**
lastName  | String | **Yes**
email     | String | **Yes**
password  | String | **Yes**

Status Code | Response
---------: | :-------
200         | Success
400         | Bad things

#### `POST` /login

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




