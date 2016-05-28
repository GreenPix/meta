{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "title": "Spell",
    "properties": {
        "id": { "type": "string" },
        "name": { "type": "string" },
        "description": { "type": "string" },
        "cost": { "type": "integer" },
        "on-start-cast": { "$ref": "#/definitions/spell-effect-array" },
        "on-end-cast": { "$ref": "#/definitions/spell-effect-array" },
        "on-cast-failure": { "$ref": "#/definitions/spell-effect-array" }
    },
    "required": ["id","name","cost"],

    "definitions": {
        "spell-effect": {
            "type": "object",
            "title": "Spell Effect",
            "oneOf": [
                {
                    "properties": { "aoe": { "$ref": "#/definitions/aoe" } },
                    "required": ["aoe"],
                    "additionalProperties": false
                },
                {
                    "properties": { "script": { "$ref": "#/definitions/script" } },
                    "required": ["script"],
                    "additionalProperties": false
                },
                {
                    "properties": { "projectile": { "$ref": "#/definitions/projectile" } },
                    "required": ["projectile"],
                    "additionalProperties": false
                }
            ]
        },
        "spell-effect-array": {
            "type": "array",
            "items": { "$ref": "#/definitions/spell-effect" }
        },
        "projectile": {
            "type": "object",
            "properties": {
                "direction": {
                    "type": "string",
                    "enum": ["north","south","east","west","front","back","left","right"],
                    "default": "front"
                },
                "hitbox": { "$ref": "#/definitions/shape" },
                "speed": { "type": "number", "minimum": 0 },
                "range": { "type": "number", "minimum": 0 },
                "friendly-fire": { "$ref": "#/definitions/friendly-fire" },
                "on-hit": { "$ref": "#/definitions/spell-effect-array" },
                "on-end-range": { "$ref": "#/definitions/spell-effect-array" }
            },
            "required": ["hitbox","speed","range"]
        },
        "disc": {
            "type": "object",
            "properties": {
                "radius": { "type": "number", "minimum": 0 }
            },
            "required": ["radius"]
        },
        "square": {
            "type": "object",
            "properties": {
                "side": { "type": "number", "minimum": 0 }
            },
            "required": ["side"]
        },
        "aoe": {
            "type": "object",
            "title": "Area of Effect",
            "properties": {
                "shape": { "$ref": "#/definitions/shape" },
                "on-hit": { "$ref": "#/definitions/spell-effect-array" },
                "friendly-fire": { "$ref": "#/definitions/friendly-fire" }
            },
            "required": ["shape","on-hit"]
        },
        "shape": {
            "type": "object",
            "title": "Shape",
            "oneOf": [
                {
                    "properties": { "disc": { "$ref": "#/definitions/disc" } },
                    "required": ["disc"],
                    "additionalProperties": false
                },
                {
                    "properties": { "square": { "$ref": "#/definitions/square" } },
                    "required": ["square"],
                    "additionalProperties": false
                }
            ]
        },
        "friendly-fire": {
            "type": "string",
            "enum": ["no", "self", "group", "all"],
            "default": "no"
        },
        "script": {
            "oneOf": [
                { "type": "string" },
                {
                    "type": "object",
                    "properties": {
                        "uuid": { "type": "string" }
                    },
                    "required": ["uuid"]
                }
            ]
        }
    }
}
