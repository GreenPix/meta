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
<Rules>          := <Instruction> | ε
<Instruction>    := <Assignment> | <If> | <Foreach>
<Assignement>    := <Variable> "=" <Rvalue>
<Rvalue>         := <Expression> | <Maybe Value>
<Maybe Value>    := <Expression> "?" <Expression>
<Expression>     := <Expression> <Two-Operand Op> <Expression>
                  | <Function> "(" <Expression> ")"
                  | <Float>
<If>             := "if" <Global> "{" <Rules> "}" <Else>?
<Else>           := else "{" <Rules> "}"
<Variable>       := <Global> | <Local>
<Global>         := "$"<Ident>(.<Ident>)*
<Local>          := <Ident>
<Ident>          := [a-z][A-Za-z-_]+
<Float>          := [0-9]+(\.[0-9]*)?
<Two-Operand Op> := "sin" | "cos" | "rand" | "min" | "max"
<Foreach>        := "foreach" "(" <Local> "," <Global> ")" "{" <Rules> "}"
```

-------------

**Revision:** 1
