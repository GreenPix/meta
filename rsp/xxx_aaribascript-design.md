- Feature name: AaribaScript design
- Start Date: 2015-09-16
- RSP number: (leave this empty)

# AaribaScript

This RSP intends to describe the AaribaScript, a dynamic scripting
language used by Lycan to describe game design rules.

## Why AaribaScript?

Game logic can either be implemented directly in the game engine (that
is, in our case, Lycan, in Rust) or outside the game
engine. Implemented the game logic inside the game engine is more
simple and more efficient, but it also specializes the game engine and
it makes the work of game designers a lot harder. On the other hand,
if the game logic is described outside the game engine source code and
loaded by it at runtime, it is easy to update game logic.

It could be possible to parameterized the game logic, that is implementing
the logic inside the game engine, but defining the constant values outside.
However, even if this proposal permits to balance the game without the
help of the Core Team, it still fixes the game logic.

Rather than using a generic and already existing scripting language
such as lua, Renaissance uses AaribaScript, a specific-domain language
specially created for Lycan. The reason behind this choice is the following:
the Core Team thinks it is a better idea to have a small and specific
language rather than a large, potentially heavy, one.

## AaribaScript Grammar

```
<Rule>                  := <Instruction> | ε
<Instruction>           := <Assignment> | <If>
<Assignement>           := <Variable> "=" <Rvalue>
<Rvalue>                := <Expression> | <Maybe Value>
<Maybe Value>           := <Expression> "?" <Expression>
<Expression>            := <Expression> <Two-Operand Op> <Expression>
                         | <Function> "(" <Expression> ")"
                         | <Float>
                         | <Variable>
<If>                    := "if" <Condition> "{" <Rule> "}" <Else>?
<Else>                  := else "{" <Rule> "}"
<Condition>             := <Condition> <Logic Operator> <Condition>
                         | <Expression> <Comparison Operator> <Expression>
                         | "defined" "(" <Global> ")"
<Variable>              := <Global> | <Local>
<Global>                := "$"<Ident>
<Local>                 := <Ident>
<Ident>                 := [a-z][A-Za-z-_\.]+
<Float>                 := [0-9]+(\.[0-9]*)?
<Two-Operand Op>        := "+" | "-" | "/" | "%" | "^"
<Logic Operator>        := "||" | "&&" | "^"
<Comparison Operator>   := "<" | ">" | "<=" | ">=" | "!=" | "=="
<Function>              := "sin" | "cos" | "rand" | "min" | "max"
```

## Aariba Semantic

### Rules and Instructions

An AaribaScript file is called a *Rule*. It is used to describe a
particular aspect of the game logic. For instance, a game engine may
need a *Rule* to deal with received damages, or to deal with monster
deaths, etc. So basically a *Rule* is a script to describe on aspect
of the game logic.

AaribaScript is a procedural language, so basically a *Rule* is a list
of *Instructions* that are executed sequentially. There are two
kinds of *Instruction* in AaribaScript:

* Assignment
* If block

### Variable

In AaribaScript, a variable is a location to store a result. Variables
can be either local or global. A local variable can only be used in a
given scope and is destroyed at the end of each execution. A global
variable, on the contrary, is a variable defined by the game engine.
It lives outside the Rules that use it. The list and function of
global variables exposed to a script depends on the context in which
the script is used, and must be documented. Reads of global variables
must not cause any side-effects, but writes to global variables may
create side-effects.

An variable identifier starts with a small letter, then any number of
letters (capital or not).  It is also possible to have underscope
inside variable identifier. This, `aaabBBBbb_bdf` is a valid variable
identifier, but `Aaaa`, `adsq_dq$` and `a_d_1` are not.

A local variable is written with a variable identifier. On the
contrary, a global variable must start with a "$" symbol in addition
to a regular variable identifier.

### AaribaScript types in expressions

Variables in AaribaScript expressions can be of two types:
* A floating-point number
* A context-defined composite structure

AaribaScript cannot operate directly on composite structures. The only
operations allowed on composite structures are:
* Assign the structure to a local variable.
* Assign the structure to a global variable.
* Access a subfield of the composite structure.

The semantics behind each of these operation are left to the implementation
of the context.

Every other operation attempted on a composite structure will result in an
error

#### Example

Documentation: "$global.effects.poison is a prototype of a composite structure
When assigning this structure to a local variable, you will get a complete
copy. This structure has two subfields of type f64: time and intensity.

Writing this structure to $target.new\_effect will cause a new poison effect
to be applied on the target"

```
// Get a copy of a poison structure
poison = $global.effects.poison;

// Initialize the fields
poison.time = 4;
poison.intensity = 10;

// Apply the effect
$target.new_effect = poison;
```

Working directly with the structure `poison` will result in an error:
```
poison = $global.effects.poison;
incorrect = $poison + 3;  // ERROR
```

### Undefined variables

In some cases, a context may specify that a variable may or may not exist. An
example would be the implementation of an arbitrary variable storage (such as
a hashmap): a variable will be defined only if it has been assigned to before.

AaribaScript allows to evaluate if a variable is defined or not by using the
following construction:
```
if defined($may_be_undefined) {
    // Can use $may_be_undefined safely
}
```

Every other operation attempted on an undefined variable will result in an
error.

-------------

**Revision:** 1
