# Rules
[Rule]: #rule

`Rules` is a system in Lycan that allow to inject the code logic for
the stats update at run-time. It has simple semantics in order be able
to decouple the balancing work from the rest over the cycle of
development of **Renaissance**.

Each rule access part of the data available on the Lycan server and
modify it during key points of the server loop. *Those will be fixed
for more clarity and simplicity*.

# Table of contents

* [Rule]
  * [Definitions]
  * [Semantics]
  * [Execution model]
  * [Entry points]
  * [Effects]

## Definitions
[Definitions]: #definitions

`Rules` obeys the following definitions:

* A rule is a list of instructions.
* An instruction consist of an assignment operation or a if clause.
  ```
  <assigment> | <if>
  ```
* An assignment operation is simply:
  ```
  <ident> "=" <expression> ";"
  ```
  where `<ident>` is an identifier made of letters and `<expression>`
  is an expression (see below).
* An expression is made of one or more operators applied to others
  expression:
  ```
  <expression> <operator> <expression> | <digit> | <ident> | <function> "(" <expression> ")"
  ```
* An operator is one of the following:
    - `*`: multiplication
    - `/`: division
    - `^`: power
    - `%`: modulo
* A function is one of the most common mathematical function:
    - `sin`: sinus
    - `cos`: cosinus
    - `rand`: random with a uniform distribution between 0 and the
      number given in arguments.
    - `min`: compute the minimum of two values.
    - `max`: compute the maximum of two values.
* An if clause is made of a condition and a body executed only if the
  condition is true.
  ```
  "if" <condition> "{" <instructions> "}"
  ```
* A condition can only be an ident. (for now)

Furthermore, it is possible to add comments to the rules.
A comment starts with `//` and everything that follow until the line
return is ignored by the Rules evaluator.

**Note:**

The convention chosen here can be updated and you will be notified of
any changes as we iterate over the implementation.

## Semantics
[Semantics]: #semantics

A rule can create any number of variable and can access global ones
defined by the Lycan server.  A rule can read them and modify
them. Each variable created by a rule are local to the rule and thus
can't be reused by another rule. They are not shared.

In the following example, the variable `a` is local to the rule and
can't be accessed by another rule:
```js
a = 23;
b = a * 2;
```

So the following rule is ill-formed:
```js
// Error b is not defined.
a = b;
```

Any **ill-formed** rule will simply be **rejected** by the server and
its execution will be stopped.

Variable defined by the server are all prefixed by `$`. This means
that the following rule can be well formed:
```js
a = $b;
```
The fact that it is ill-formed or not depend only on the Lycan
server. The server gives access to a set of known variables. Accessing
a variable that is not available is equivalent to turn the rule into
an ill-formed one. This set of variable is defined later in this
proposal see [Entry points].

An `if` instruction check for the definition of the variable, so
```js
if a {
  b = 23;
}
```
will never be executed. However the following:
```js
if $a {
  b = 23;
}
```
will only be executed if `$a` is defined when the rules is
executed. See [Entry points] for more information about the use of
this.

## Execution model
[Execution model]: #execution-model

A rule execution order depend on the order of the instructions in the
file.  Instructions are executed in the order they're defined:

```js
a = 32;     // Executed first
b = 20;     // Executed in second
c = a + b;  // etc...
```

Instructions are imperative, thus the following is true:

```js
a = 23;
b = a * 2;  // (1)
a = 12;
c = b;      // Here c is 46 and not 24.
```

As you can see, the assignment is not reactive/formal, after (1) `b`
contains the value of `a` that `a` contains at that point.

A variable can have two states: It is either defined and contains a
value or it is undefined. As using an undefined variable turns the
rule into an ill-formed one, when a global variable might be present
or not like an **effect**, it is common to wrap the instruction around
an `if`.

## Entry points
[Entry points]: #entry-points

Lycan manipulate entities. `Rules` applies on entities that either
players or monsters.  It has been defined for now that only 3 entry
points would be available on each entity:

- `dmg_recv`: a rule called whenever an entity has received damages.
- `time`: a rule called *often*. This is were DOT (damage over time)
  effects will be handled.
- `entity_killed`: a rule called whenever an entity has died.

Everytime an entry point access a variable from an entity, Lycan
provides the following variables for that entity:

- `$<entity_name>.hp`
- `$<entity_name>.xp`
- `$<entity_name>.lvl`
- `$<entity_name>.speed`
- `$<entity_name>.strength`
- `$<entity_name>.wisdom`
- `$<entity_name>.critical_strike`

And also a number of effects that provides the following variables for
each effect taking place:

- `$<entity_name>.<effect_name>.factor`
- `$<entity_name>.<effect_name>.time`

### `dmg_recv`

This rule can access all the variable from the entity named `me` and
`dmg`. Thus we can access:

- `$me.hp`
- `$me.xp`
- ...

Here `me` refers to the entity that has done some damaged to the entity `dmg`.

Example of possible rule:

```js
$dmg.hp -= $me.strength * ( 1 + rand($me.critical_strike) );
```

### `entity_killed`

This rule can access all the variables from the entity `me` and `dmg`.

Here `me` refers to the entity that has killed the entity `dmg`.

Example of possible rule:

```js
$me.xp += $dmg.lvl * 1000;
```

### `time`

This rule can access all the variables from the entity `me` and also
a variable `dt` which is expressed in seconds.  The latter correspond to the
time elapsed between the previous execution of the rule and the
current execution.

Example of possible rule:

```js
// Check if the dot is still present
// The way effects works, it would be
// equivalent to test $me.dot.time
if $me.dot.factor {
  // Here, our entity loose 'factor' health point per seconds.
  $me.hp -= $me.dot.factor * $dt;
}

// Here we inflict damage over time
// following the exponential function
e = 2.71828;
if $me.curse.factor {
  // Here we're doing a simple integration of our function over time using an euler method
  $me.hp -= $dt * e ^ (20 - $me.curse.time);
}
```

## Effects
[Effects]: #effects

While effects will be described more precisely in another RFC, a few
things are good to know about them:

* An effect has only two properties `time` and `factor`.
  - `factor` is a value that has no particular meaning (except the one
    given by the effect name description)
  - `time` is a duration in seconds representing the amount of time left
    before the end of the effect.

* An effect is attached to an entity and is intended be used to customize
  the way stats for that entity are computed. But only the rules will tell
  you how it does that customization.

* The `time` script will be invoked as needed in order to make sure
  that the total sum of `$dt` while an effect is active will always
  be equal to the effect duration. While this is an implementation
  detail, it means that the value `<effect_name>.time` will behave as
  expected.
