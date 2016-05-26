- Feature name: Lycan REST API v1
- Start Date: 2016-03-09
- RSP number: (leave this empty)

Lycan REST API v1
=================

This API is the management API of Lycan. It is supposed to be only used by an admin, and therefore
all requests must be properly authenticated.

API base:

/api/v1

All methods are authenticated using an "Access-Token" HTTP header.

A request without the proper header, or with invalid header will return an error code
401: Unauthorized

In this specification, unless specified otherwise, an "id" field will be volatile,
and will lose its meaning after a reboot of Lycan

XXX: How to get the access token? Command line argument (vulnerable to ps on the host)? Environment
variable? Got from another server?

## GET /maps

Use this method to get available maps

XXX: What is the data associated with a map?

### Returns

```javascript
[
{
    "uuid": "a9e05dd7-dc00-40b0-966e-29f9ef34887e",
    "name": "A map name"
},
{
    "uuid": "09e99575-584e-4db6-9e2e-4db1dd1bfaa7",
    "name": "Another map name"
}
]
```

## GET /maps/:uuid/instances

Get running instances for a particular map

### Returns

```javascript
[
{
    "id": 2,
    "map": ":uuid",
    "created_at": "Thu, 26 May 2016 13:03:11 GMT"
},
{
    "id": 3,
    "map": ":uuid",
    "created_at": "Thu, 26 May 2016 11:00:11 GMT"
}
]
```

## GET /instances/:id/entities

Get entities in a particular instance

Parameters:
* `:id`: volatile ID returned by a previous call (e.g. `GET /maps/0/instances`)

Filtering:
* `type`: Comma-separated list of types to return info about ("monster", "player", "npc")
* `id`: Comma-separated list of ID of entities to return info about

Example: `GET /intances/12/entities?id=4,5`

### Returns

```javascript
[
{
    "id": 4,
    "type": {
        "player": {
            "uuid": "48e8c107-e4e1-4db5-b805-d31141f5ad09",
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
        "map": "09e99575-584e-4db6-9e2e-4db1dd1bfaa7",
        "instance": ":id"
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
            "monster_class": "67e6001e-d735-461d-b32e-2e545e12b3d2",
            "name": "zombie",
            "behaviour_tree": "zombie.bt"
        }
    },
    "skin": 0,
    "current_pv": 100,
    "position": {
        "x": 0.0,
        "y": 10.0,
        "map": "09e99575-584e-4db6-9e2e-4db1dd1bfaa7",
        "instance": ":id"
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
    "monster_class": "67e6001e-d735-461d-b32e-2e545e12b3d2",
    "x": 0.0,
    "y": 10.0
}
```

Parameters:
* `:id`: volatile ID returned by a previous call (e.g. `GET /maps/0/instances`)
* `monster_class`: UUID defining the monster to spawn

Optional parameters:
* `x`: Default value 0.0
* `y`: Default value 0.0

### Returns

```javascript
{
    "id": 6,
    "type": {
        "monster": {
            "monster_class": "67e6001e-d735-461d-b32e-2e545e12b3d2",
            "name": "zombie",
            "behaviour_tree": "zombie.bt"
        }
    },
    "current_pv": 100,
    "position": {
        "x": 0.0,
        "y": 10.0,
        "map": "09e99575-584e-4db6-9e2e-4db1dd1bfaa7",
        "instance": ":id"
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

## DELETE /instances/:instance\_id/entities/:entity\_id

Removes a mob from the game

Parameters:
* `:instance_id`: volatile ID returned by a previous call (e.g. `GET /maps/0/instances`)
* `:entity_id`: volatile ID returned by a previous call (e.g. `GET /instances/:instance_id/entities`)

XXX: Should it kick players as well?

## GET /players

Get list of connected players

Filtering:
* `name`: Comma-separated list of regex to match name with
* `uuid`: Comma-separated list of player UUID to match
* `id`: Comma-separated list of entities volatile ID to match

To filter "by instance", use `GET /instances/:id/entities?type=player` instead

Examples:
* `GET /players?name=Vael*`
* `GET /players?uuid=48e8c107-e4e1-4db5-b805-d31141f5ad09`
* `GET /players?id=4`

### Returns

```javascript
[
{
    "id": 4,
    "type": {
        "player": {
            "uuid": "48e8c107-e4e1-4db5-b805-d31141f5ad09",
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
        "map": "09e99575-584e-4db6-9e2e-4db1dd1bfaa7",
        "instance": "2"
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
## POST /connect\_character

Connects a character to the game

### Body

```javascript
{
    "token": "0123456789abcdefgh",
    "uuid": "48e8c107-e4e1-4db5-b805-d31141f5ad09"
}
```

### Returns

XXX: Should it return an error if the player uuid is non-existent (i.e. not found in the db)? Or
should we consider it is already checked by bz and assume it is correct?

## POST /shutdown

### Body

```javascript
{
    "date": "Thu, 26 May 2016 16:04:32 GMT"
}
```

### Returns

XXX: Token to cancel the shutdown?

Revision: WIP
