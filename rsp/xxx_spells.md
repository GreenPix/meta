- Feature name: Spells
- Start Date: 2016-05-28
- RSP number: (leave this empty)

Spells
======

## Introduction

Renaissance is a heroic-fantasy RPG game and as such, needs to have a good Spell system. This RSP
proposes a way to describe spells, which should be powerful enough to describe even the most complex
spell!

A spell will be described as a combination of "Spell Effect", each "Spell Effect" being described
by an AaribaScript or a combination of other "Spell Effect". A "Spell Effect" not described directly
by a script can be, for example, a projectile that will trigger other "Spell Effect" when it hits a
target.

A script executed as part of the spell will have the possibility of triggering other "Spell Effects"
described in the spell (e.g. spawn another projectile), thus allowing to create really powerful
spells.

## Description

This [JSON schema](/schemas/spells-schema.json) describes the structure of a spell. The rest of this
RSP will describe each of the fields of the structures described in the schema.

### Spell

#### `name`

A human-friendly name

#### `uuid`

A unique UUID for this spell

#### `cost`

The mana cost of this spell

#### `description`

A human-friendly description

#### `definitions`

A list of "Spell Effects" or "Shape" that can be reused from the scripts in the `$spell` namespace

#### `on-start-cast`
A list of "Spell Effects" that will be executed when an entity starts casting that
spell

Environment:
* `$caster` (in, out): a handle to the `Entity` that casts the spell
* `$interrupt` (out): writing to this variable will cause the spell to fail, preventing subsequent
                      "Spell Effect" from being executed. The `on-cast-failure` effects will be
                      executed.
* `$spell` (in): Namespace to access the `definitions` section of the spell
* `$lycan` (in, out): a handle to the current state of the game. See "Lycan"

#### `on-end-cast`
A list of "Spell Effects" that will be executed when an entity finishes casting that spell

Environment:
* `$caster` (in, out): a handle to the `Entity` that casts the spell
* `$interrupt` (out): writing to this variable will cause the spell to fail, preventing subsequent
                      "Spell Effect" from being executed. The `on-cast-failure` effects will be
                      executed.
* `$spell` (in): Namespace to access the `definitions` section of the spell
* `$lycan` (in, out): a handle to the current state of the game. See "Lycan"

#### `on-cast-failure`
A list of "Spell Effects" that will be executed when an entity fails to cast that spell

Environment:
* `$caster` (in, out): a handle to the `Entity` that casts the spell
* `$spell` (in): Namespace to access the `definitions` section of the spell
* `$lycan` (in, out): a handle to the current state of the game. See "Lycan"

### Spell Effect

An enumeration which can be of one of the following types:
* Script
* Projectile
* AOE

### Script

Executes the associated AaribaScript with the inherited environment.

### Projectile

Creates a new projectile. The projectile stops at the first entity hit. A piercing projectile can be
expressed by recreating the same projectile, with the range of the parent.

#### `direction`

An enumeration, that can take the following values:
* `north`: The projectile will go north
* `south`: The projectile will go south
* `east`: The projectile will go east
* `west`: The projectile will go west
* `front`: The projectile will go in the same direction as the parent
* `back`: The projectile will go in the opposite direction of the parent
* `left`: The projectile will go in the left of the parent
* `right`: The projectile will go in the right of the parent

Default value: `front`

#### `hitbox`

An object of type Shape describing the hitbox of the projectile

#### `speed`

The speed of the projectile, in tiles/s

#### `range`

The range of the projectile, in tiles

#### `friendly-fire`

See Friendly Fire

#### `on-hit`

A list of "Spell Effect" that will be executed when the projectile hits a target

Environment:
* `$caster` (in, out): The caster when the projectile was launched (see "Entity snapshot")
* `$target` (in, out): a handle to the `Entity` that has been hit.
* `$self` (in): a handle to the projectile. See "Projectile"
* `$spell` (in): Namespace to access the `definitions` section of the spell
* `$lycan` (in, out): a handle to the current state of the game. See "Lycan"

#### `on-end-range`

A list of "Spell Effect" that will be executed when the projectile gets to its maximum range.

Environment:
* `$caster` (in, out): The caster when the projectile was launched (see "Entity snapshot")
* `$spell` (in): Namespace to access the `definitions` section of the spell
* `$lycan` (in, out): a handle to the current state of the game. See "Lycan"

### AOE

Creates an Area of Effect

TODO: Add the time aspect to AOE

#### `shape`

An object of type Shape describing the hitbox of the AOE

#### `friendly-fire`

See Friendly Fire

#### `on-hit`

A list of "Spell Effect" that will be executed for each entity hit by the AOE

Environment:
* `$stop` (out): writing to this variable causes the AOE to stop hitting further targets.
* `$caster` (in, out): The caster when the AOE was started (see "Entity snapshot")
* `$target` (in, out): a handle to the `Entity` that has been hit.


### Shape

An enumeration, that can be of the following types:
* Disc
* Square

### Disc

An object describing a disc

#### `radius`

The radius, in tiles, of the disc

### Square

An object describing a square

#### `side`

The side, in tiles, of the square

### Friendly Fire

An enumeration, that can take the following values:
* `no`: Only targets foes
* `self`: Targets both foes and the caster
* `group`: Targets foes and the allies of the caster, but not the caster himself
* `all`: Targets foes, the caster and his group

## Types exposed to AaribaScript

Each scripts defined in spells will be executed in a particular environment, with access to various
variables that can be used by the script to read values or act on those.

Those different variables will have different properties, that are listed here.

### Entity

A handle to an entity involved in a spell. It can be used to read some stats (force, hp), inflict
damages, read/create effects (poison, stun).

#### (in) `stats`

A handle to the current stats of the entity (with modifier applied)

#### (in) `base_stats`

A handle to the bast stats of the entity (without modifiers)

#### (in) `hp`

The current hp of the entity

#### (out) `damages`

Writing in this variable will inflict damages to the entity

#### (in, out) `effects`

Handle to current effects applied to the entity.

TODO: RSP about effects

#### TODO: Finish

### Stats

A read-only object giving access to the stats of the player:

* strength
* dexterity
* constitution
* intelligence
* precision
* wisdom
* level

### Entity snapshot

A handle to a representation of an entity at some point in the past (e.g. when a projectile was
                                                                     fired)

It has the same "in" variables (stats, hp etc.) as the "Entity" type, but none of its "out" variables.

#### (in, out) `current`

This gives a handle to the same Entity with its current state (and not the one it had at some point
                                                               in the past).
It is not guaranteed to exists, for example when the caster of a projectile died or left the map
after firing it.

The existence of this entity should therefore be tested before being used.

Example:

`if exists($caster.current) { $caster.current.damages = 3; }`

### Projectile

A handle to the projectile.

#### (in) `remaining_range`

The remaining range of the projectile

#### TODO: Local, arbitrary storage

#### TODO: Finish

### Lycan

A handle to the current state of the game, that can be used to take actions not related to a
particular entity (e.g. spawn a projectile)

#### (out) `spawn`

A variable that, when a projectile or an AOE is assigned to it, will spawn said projectile or AOE

Example:

`$lycan.spawn = $spell.spear;`

#### (in) `effects`

A list of effects available to the script

TODO

## Examples

```javascript
{
    "uuid": "b2050a64-7eb2-42ac-9138-1329670b43a8",
    "name": "Fireball",
    "description": "A projectile that will stop at the first target hit, and do lower damages in the zone",
    "cost": 2,
    "on-end-cast": [
        {
            "projectile": {
                "direction": "front",
                "speed": 1,
                "range": 9.5,
                "hitbox": {
                    "disc": {
                        "radius": 0.5
                    }
                },
                "on-hit": [
                    { "script": "$target.damages = $caster.stats.intelligence*2;" },
                    { "$ref": "#/definitions/end-aoe" }
                ],
                "on-end-range": [
                    { "$ref": "#/definitions/end-aoe" }
                ]
            }
        }
    ],
    "definitions": {
        "end-aoe": {
            "aoe": {
                "shape": {
                    "square": {
                        "side": 2
                    }
                },
                "on-hit": [
                    { "script": "$target.damages = $caster.stats.intelligence;" }
                ]
            }
        }
    }
}
```
```javascript
{
    "uuid": "b7380dc3-cc32-46a3-adf0-010a47bed1cd",
    "name": "Spear",
    "description": "A projectile that will pierce through enemies",
    "__comment": "The script is missing the 'prevent the newly spawned spear to re-hit the same target'",
    "cost": 2,
    "on-end-cast": [
        { "$ref": "#/definitions/spear" }
    ],
    "definitions": {
        "spear": {
            "projectile": {
                "direction": "front",
                "speed": 1,
                "range": 9.5,
                "hitbox": {
                    "disc": {
                        "radius": 0.5
                    }
                },
                "on-hit": [
                    { "script": "$target.damages = $caster.stats.intelligence*3; new_spear = $spell.spear; new_spear.range = $parent.remaining_range; $lycan.spawn = new_spear;" }
                ]
            }
        }
    }
}
```
```
{
    "uuid": "37bd0f96-a143-4ca6-85cf-de9acb3ccb4b",
    "name": "Fire Nova",
    "description": "Damages nearby ennemies. Burns the caster if he is oiled, fails if he is wet.",
    "cost": 2,
    "on-start-cast": [
        {
            "script": "if [$caster.effects.wet] { $interrupt = 1; }"
        }
    ],
    "on-end-cast": [
        {
            "script": " // This portion needs to be one-lined to be valid JSON
                        if [$caster.effects.oiled]
                        {
                            $caster.effects.oiled.remove = 1;
                            burning = $lycan.effects.burning;
                            burning.intensity = $caster.stats.intelligence / $caster.stats.wisdom;
                            burning.duration = 6;
                            $caster.new_effect = burning;
                        }
                      "
        },
        {
            "aoe": {
                "shape": {
                    "disc": {
                        "radius": 1.5
                    }
                },
                "friendly-fire": "no",
                "on-hit": [
                    { "script": "$target.damage = $caster.stats.intelligence * 3" }
                ]
            }
        }
    ]
}
```
