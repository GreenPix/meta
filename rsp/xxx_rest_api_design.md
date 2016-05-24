- Feature name: Lycan REST API v1
- Start Date: 2016-03-09
- RSP number: (leave this empty)

Lycan REST API v1
=================

API base:

/api/v1

All methods are authenticated using a Access-Token HTTP header.

A request without the proper header, or with invalid header will return an error code
401: Unauthorized

XXX: How to get the access token?

## GET /maps

Use this method to get available maps

XXX: What is the data associated with a map?

### Returns

```javascript
[
{
    "id": 0
},
{
    "id": 1
}
]
```

## GET /maps/:id/instances

Get running instances for a particular map

### Returns

```javascript
[
{
    "id": 2,
    "map": 0,
    "uptime": 1000
},
{
    "id": 3,
    "map": 0,
    "uptime": 30
}
]
```

## GET /instances/:id/entities

Get entities in a particular instance

Parameters:
* `type`: Restricts search to the specified type ("monster" or "player")

### Returns

```javascript
[
{
    "id": 4,
    "type": {
        "player": {
            "id": 1,
            "name": "Vaelden",
            "gold": 42,
            "experience": 43,
            "guild": "God"
        }
    },
    "skin": 1,
    "current_pv": 100,
    "position": {
        "x": 0.1,
        "y": 42.42,
        "map": 0,
        "instance": 2
    },
    "stats": {
        "level": 1,
        "strength": 2,
        "dexterity": 3,
        "constitution": 4,
        "intelligence": 5,
        "precision": 6,
        "wisdom": 7
    }
},
{
    "id": 5,
    "type": {
        "monster": {
            "id": 3,
            "name": "zombie",
            "behaviour_tree": "zombie.bt"
        }
    },
    "skin": 0,
    "current_pv": 100,
    "position": {
        "x": 0.0,
        "y": 10.0,
        "map": 0,
        "instance": 3
    },
    "stats": {
        "level": 7,
        "strength": 6,
        "dexterity": 5,
        "constitution": 4,
        "intelligence": 3,
        "precision": 2,
        "wisdom": 1
    }
}
]
```

## POST /instances/:id/spawn

Spawn a specific mob in the instance

### Body

```javascript
{
    "monster_class": 3,
    "x": 0.0,
    "y": 10.0
}
```

Optional parameters:
* `x`: Default value 0.0
* `y`: Default value 0.0

### Returns

```javascript
{
    "id": 6,
    "type": {
        "monster": {
            "id": 3,
            "name": "zombie",
            "behaviour_tree": "zombie.bt"
        }
    },
    "current_pv": 100,
    "position": {
        "x": 0.0,
        "y": 10.0,
        "map": 0,
        "instance": 3
    },
    "stats": {
        "level": 7,
        "strength": 6,
        "dexterity": 5,
        "constitution": 4,
        "intelligence": 3,
        "precision": 2,
        "wisdom": 1
    }
}
```

## DELETE /instances/:id/entities/:id

Removes a mob from the game

XXX: Should it kick players as well?

## GET /players

Get list of connected players

### Returns

```javascript
[
{
    "id": 4,
    "type": {
        "player": {
            "id": 1,
            "name": "Vaelden",
            "gold": 42,
            "experience": 43,
            "guild": "God"
        }
    },
    "skin": 1,
    "current_pv": 100,
    "position": {
        "x": 0.1,
        "y": 42.42,
        "map": 0,
        "instance": 2
    },
    "stats": {
        "level": 1,
        "strength": 2,
        "dexterity": 3,
        "constitution": 4,
        "intelligence": 5,
        "precision": 6,
        "wisdom": 7
    }
}
]
```
## DELETE /players/:id

Kicks a player from the game

XXX: Banning - Should we do it from the management console (i.e. block account, then kick from
                                                            Lycan?)
## POST /shutdown

### Body

```javascript
{
    "time": 60
}
```

### Returns

XXX: Token to cancel the shutdown?

## POST /connect\_character

Connects a character to the game

### Body

```javascript
{
    "token": "0123456789abcdefgh",
    "id": 42
}
```

### Returns

XXX: Should it return an error if the player id is non-existent (i.e. not found in the db)? Or
should we consider it is already checked by bz and assume it is correct?

Revision: WIP
