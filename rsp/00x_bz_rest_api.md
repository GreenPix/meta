# RSP - 1 — *bz* REST API

## `POST /login`

### Synopsis

Use this method to authenticate.

### Request body

```json
{
    "email": "$(email: String)",
    "passwd": "$(passwd: String)"
}
```

### Response body

```json
{
    "id": "$(id: Int)",
    "infos": {
        "email": "$(email: String)"
    }
}
```

### Response status

Code | Description
-----|-------------
200  | Success
400  | Error in request body
403  | This account is already connected
404  | No account for the given url

## GET `/:id/characters`

### Synopsis

Retreive a list of the characters the player `:id` can play with

### Response body

```json
[
    {
        "id": "$(id: Int)",
        "infos": {
            "name": "$(name: String)"
        }
    },
    ...
]
```

### Response status

Code | Description
-----|-------------
200  | Success
401  | Not authenticated as `:id`
403  | A game session has already been started

## `POST /:id/characters/new`

### Synopsis

Create a new character for the account `:id`. One can uses
the *Location* header field to retreive more informations
about the created resource.

### Request body

```json
{
    "name": "$(name: String)"
}
```

### Response status

Code | Description
-----|-------------
201  | Success (see *Location* header field)
400  | Error in request body
401  | Not authenticated as `:id`
403  | Name already used by another character or already in a game session

## GET `/:id/characters/:id_c`

### Synopsis

Retreive all available data about the character `:id_c` of the account
`:id`.

### Response body

```json
{
    "name": "$(name: String)"
}
```

### Response status

Code | Description
-----|-------------
200  | Success
401  | Not authenticated as `:id`
403  | A game session has already been started
404  | The character `:id_c` does not exist

## `POST /name_availability`

### Synopsis

Check if a name is available for a character.

### Request body

```json
{
    "name": "$(name)",
}
```

### Response body

```json
{
    "available": "$(b: Bool)",
}
```

### Response status

Code | Description
-----|-------------
204  | Success
400  | Error in request body

## `POST /logout`

### Synopsis

End the current session

### Response status

Code | Description
-----|-------------
204  | Success
401  | Not authenticated

---------------------

**Revision:** 1
