- Feature name: Spells
- Start Date: 2016-05-28
- RSP number: (leave this empty)

Spells
======

## JSON Schema

The JSON schema is available [here](/schemas/spells-schema.json)

## Example

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

## Fields

### Cost

Mana cost for launching the spell

### on-start-cast

List of "Spell Effect" that are triggered when the spell is starting to cast

Exposed variables:
* $caster (in, out): The entity casting the spell
* $result (out): Writing a non-zero value causes the spell to fail, and will trigger the
                 on-cast-failure. Next "Spell Effect" are not executed.

### on-end-cast

List of "Spell Effect" that are triggered when the spell is cast successfully

Exposed variables:
* $caster (in, out): The entity casting the spell
* $result (out): Writing a non-zero value causes the spell to fail, and will trigger the
                 on-cast-failure. Next "Spell Effect" are not executed.

### on-cast-failure

List of "Spell Effect" that are triggered if the spell is interrupted

Exposed variables:
* $caster (in, out): The entity casting the spell

## Spell Effect

A Spell Effect can be of several types

### script

An AaribaScript that will be executed with the current exposed variables

### aoe

An Area of Effect

### projectile

A projectile, with a hitbox, speed, range etc.
