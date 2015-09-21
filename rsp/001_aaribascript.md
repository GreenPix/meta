# RSP - 1 – AaribaScript

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
<Rule>          := <Instruction> | ε
<Instruction>    := <Assignment> | <If> | <Foreach>
<Assignement>    := <Variable> "=" <Rvalue>
<Rvalue>         := <Expression> | <Maybe Value>
<Maybe Value>    := <Expression> "?" <Expression>
<Expression>     := <Expression> <Two-Operand Op> <Expression>
                  | <Function> "(" <Expression> ")"
                  | <Float>
<If>             := "if" <Global> "{" <Rule> "}" <Else>?
<Else>           := else "{" <Rule> "}"
<Variable>       := <Global> | <Local>
<Global>         := "$"<Ident>(.<Ident>)*
<Local>          := <Ident>
<Ident>          := [a-z][A-Za-z-_]+
<Float>          := [0-9]+(\.[0-9]*)?
<Two-Operand Op> := "+" | "-" | "/" | "%" | "^"
<Function>       := "sin" | "cos" | "rand" | "min" | "max"
<Foreach>        := "foreach" "(" <Local> "," <Global> ")" "{" <Rule> "}"
```

## Aariba Semantic

### Rules and Instructions

An AaribaScript file is called a *Rule*. It is used to describe a
particular aspect of the game logic. For instance, a game engine may
need a *Rule* to deal with received damages, or to deal with monster
deaths, etc. So basically a *Rule* is a script to describe on aspect
of the game logic.

AaribaScript is a procedural language, so basically a *Rule* is a list
of *Instructions* that are executed sequentially. There are three
kinds of *Instruction* in AaribaScript:

* Assignment
* If block
* Foreach block

### Variable

In AaribaScript, a variable is a location to store a result. Variable
can be either local or global. A local variable can only be used in a
given scope and is destroyed at the end of each execution. A global
variable, on the contrary, is a variable defined by the game engine.
It lives outside the Rules that use it. Thus, if a Rule modifies a
global variable, the new value is available to each Rule that uses it
after that.

An variable identifier starts with a small letter, then any number of
letters (capital or not).  It is also possible to have underscope
inside variable identifier. This, `aaabBBBbb_bdf` is a valid variable
identifier, but `Aaaa`, `adsq_dq$` and `a_d_1` are not.

A local variable is written with a variable identifier. On the
contrary, a global variable is identify with a "$" symbol in addition
to a regular variable identifier.

-------------

**Revision:** 1
