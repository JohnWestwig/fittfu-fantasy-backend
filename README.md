# fittfu-fantasy-backend
Server for FITTFU Fantasy.  Exposes a RESTful API.  Uses token authorization for most requests.  See docs for details.

API

   GET /leagues
   GET /leagues/{id}
   GET /leagues/{id}/teams
   GET /leagues/{id}/weeks
   GET /leagues/{id}/weeks/current

   GET /weeks/{id}
   GET /weeks/{id}/games
   GET /weeks/{id}/lineups
   GET /weeks/{id}/lineups/me

   GET /games/{id}

   GET /lineups/{id}
   GET /lineups/{id}/players
   PUT /lineups/{id}/players/{id}
DELETE /lineups/{id}/players/{id}




