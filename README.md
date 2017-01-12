# fittfu-fantasy-backend
Server for FITTFU Fantasy.  Exposes a RESTful API.  Uses token authorization for most requests.  See docs for details.
# API Documentation
Base URL: **localhost:8000**

Parameters are either encoded in JSON in the request body, or, when noted, as query string parameters.  All endpoints will return 400 on JSON parse failure.

Requests to api/* **must** include x-token={token} in the request header.  A missing or invalid token will result in a 400 error.

Errors are returned in JSON format along with an appropriate HTTP status code.
```
{
  errorCode: ****
  message: General error explanation,
  description: More details about the error
}
```

## Users

### `POST` /register
*Registers a new user.*

<table>
    <thead>
        <th>Parameter</th>
        <th>Method</th>
        <th>Required?</th>
        <th>Validation</th>
    </thead>
    <tbody>
        <tr>
        	<td align='center'>email</td>
        	<td align='center'>Body</td>
			<td align='center'>Yes</td>
			<td align='center'>Non-empty, email-format</td>
		</tr>
        <tr>
			<td align='center'>password</td>
			<td align='center'>Body</td>
			<td align='center'>Yes</td>
			<td align='center'>Non-empty</td>
		</tr>
        <tr>
			<td align='center'>firstName</td>
			<td align='center'>Body</td>
			<td align='center'>Yes</td>
			<td align='center'>Non-empty</td>
		</tr>
        <tr>
			<td align='center'>lastName</td>
			<td align='center'>Body</td>
			<td align='center'>Yes</td>
			<td align='center'>Non-empty</td>
		</tr>
    </tbody>
</table>

#### Success
<table>
    <thead>
        <th>HTTP Code</th>
        <th>Data</th>
    </thead>
    <tbody>
        <tr>
        	<td align='center'>200</td>
        	<td align='center'><pre>{}</pre></td>
		</tr>
    </tbody>
</table>

#### Failure
<table>
    <thead>
        <th>HTTP Code</th>
        <th>Error Code</th>
        <th>Info</th>
    </thead>
    <tbody>
        <tr>
        	<td align='center'>400</td>
        	<td align='center'>1000</td>
			<td align='center'>Field validation</td>
		</tr>
        <tr>
			<td align='center'>400</td>
			<td align='center'>1001</td>
			<td align='center'>E-mail already in use</td>
		</tr>
        <tr>
			<td align='center'>500</td>
			<td align='center'>1002</td>
			<td align='center'>Could not hash password</td>
		</tr>
        <tr>
			<td align='center'>500</td>
			<td align='center'>1003</td>
			<td align='center'>Database error (unknown)</td>
		</tr>
    </tbody>
</table>

#### `POST` /login
*Retrieves an API token for a user.  The token is valid for 24 hours.*

<table>
    <thead>
        <th>Parameter</th>
        <th>Method</th>
        <th>Required?</th>
        <th>Validation</th>
    </thead>
    <tbody>
        <tr>
        	<td align='center'>email</td>
        	<td align='center'>Body</td>
			<td align='center'>Yes</td>
			<td align='center'>Non-empty, email-format</td>
		</tr>
        <tr>
			<td align='center'>password</td>
			<td align='center'>Body</td>
			<td align='center'>Yes</td>
			<td align='center'>Non-empty</td>
		</tr>
    </tbody>
</table>

#### Success
<table>
	<thead>
	<th>HTTP Code</th>
	<th>Data</th>
	</thead>
	<tbody>
		<tr>
		<td align='center'>200</td>
		<td>
		<pre>{<br/>    token: "exampleToken"<br/>}</pre>
		</td>
		</tr>
	</tbody>
</table>

#### Failure

<table>
    <thead>
        <th>HTTP Code</th>
        <th>Error Code</th>
        <th>Info</th>
    </thead>
    <tbody>
        <tr>
            <td align='center'>400</td>
            <td align='center'>1000</td>
            <td align='center'>Validation error</td>
        </tr>
        <tr>
            <td align='center'>400</td>
            <td align='center'>1001</td>
            <td align='center'>Email not found</td>
        </tr>
        <tr>
            <td align='center'>400</td>
            <td align='center'>1002</td>
            <td align='center'>Password incorrect</td>
        </tr>
        <tr>
            <td align='center'>500</td>
            <td align='center'>1003</td>
            <td align='center'>Database error (unknown)</td>
        </tr>
        <tr>
            <td align='center'>500</td>
            <td align='center'>1004</td>
            <td align='center'>Hash error</td>
        </tr>
    </tbody>
</table>

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




