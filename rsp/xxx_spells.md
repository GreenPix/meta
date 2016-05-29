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

## Description

This [JSON schema](/schemas/spells-schema.json) describes the structure of a spell. The rest of this
RSP will describe each of the fields of the structures described in the schema.

### Spell

#### `name`

A human-friendly name

#### `cost`

The mana cost of this spell

#### `description`

A human-friendly description

#### `on-start-cast`
A list of "Spell Effects" that will be executed when an entity starts casting that
spell

Environment:
* `$caster` (in, out): a handle to the `Entity` that casts the spell
* `$interrupt` (out): writing to this variable will cause the spell to fail, preventing subsequent
                      "Spell Effect" from being executed. The `on-cast-failure` effects will be
                      executed.

#### `on-end-cast`
A list of "Spell Effects" that will be executed when an entity finishes casting that spell

Environment:
* `$caster` (in, out): a handle to the `Entity` that casts the spell
* `$interrupt` (out): writing to this variable will cause the spell to fail, preventing subsequent
                      "Spell Effect" from being executed. The `on-cast-failure` effects will be
                      executed.

#### `on-cast-failure`
A list of "Spell Effects" that will be executed when an entity fails to cast that spell

Environment:
* `$caster` (in, out): a handle to the `Entity` that casts the spell

### Spell Effect

An enumeration which can be of one of the following types:
* Script
* Projectile
* AOE

### Script

Executes the associated AaribaScript with the inherited environment.

### Projectile

Creates a new projectile

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
* `$caster` (in, out): a handle to the `Entity` that cast the spell.
* `$target` (in, out): a handle to the `Entity` that has been hit.
* `$stop` (out): writing to this variable causes the projectile to stop and will hit no further
                 target. It will execute its `on-end-range` "Spell Effect".

#### `on-end-range`

A list of "Spell Effect" that will be executed when the projectile gets to its maximum range, or is
stopped by one of the `on-hit` effects.

Environment:
* `$caster` (in, out): a handle to the `Entity` that cast the spell

### AOE

Creates an Area of Effect

#### `shape`

An object of type Shape describing the hitbox of the AOE

#### `friendly-fire`

See Friendly Fire

#### `on-hit`

A list of "Spell Effect" that will be executed for each entity hit by the AOE

Environment:
* `$caster` (in, out): a handle to the `Entity` that cast the spell.
* `$target` (in, out): a handle to the `Entity` that has been hit.
* `$stop` (out): writing to this variable causes the AOE to stop hitting further targets.


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

## Examples

```javascript
{
    "id": "b2050a64-7eb2-42ac-9138-1329670b43a8",
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
                    { "script": "$target.damages = $caster.intelligence*2; $stop = 1;" }
                ],
                "on-end-range": [
                    {
                        "aoe": {
                            "shape": {
                                "square": {
                                    "side": 2
                                }
                            },
                            "on-hit": [
                                { "script": "$target.damages = $caster.intelligence;" }
                            ]
                        }
                    }
                ]
            }
        }
    ]
}
```
```
{
    "id": "37bd0f96-a143-4ca6-85cf-de9acb3ccb4b",
    "name": "Fire Nova",
    "description": "Damages nearby ennemies. Burns the caster if he is oiled, fails if he is wet."
    "cost": 2,
    "on-start-cast": [
        {
            "script": "if [$caster.marker.wet] { $result=0; }"
        }
    ],
    "on-end-cast": [
        {
            "script": " // This portion needs to be one-lined to be valid JSON
                        if [$caster.marker.oiled]
                        {
                            $caster.marker.oiled.remove = 1;
                            burning = $global.effects.burning;
                            burning.intensity = $caster.intelligence / $caster.wisdom;
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
                    { "script": "$target.damage = $caster.intelligence * 3" }
                ]
            }
        }
    ]
}
```
