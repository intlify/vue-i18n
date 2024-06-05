# High-level architecture

## Intlify Message Syntax

The Message Syntax specification used in Vue I18n is defined [here](./spec/syntax.ebnf).

## Intlify Message AST structure

```mermaid
flowchart TD
  ResourceNode --> MessageNode
  ResourceNode --> PluralNode
  PluralNode --> MessageNode
  MessageNode --> MessageElementNode
  MessageElementNode --> TextNode
  MessageElementNode --> NamedNode
  MessageElementNode --> ListNode
  MessageElementNode --> LiteralNode
  MessageElementNode --> LinkedNode
  LinkedNode --> LinkedModifierNode
  LinkedNode --> LinkedKeyNode
  LinkedNode --> NamedNode
  LinkedNode --> ListNode
  LinkedNode --> LiteralNode
```
