import { expect, it } from "vitest";
import lex from "../src/lex";
import {
  IdentifierToken,
  EqToken,
  NumberToken,
  AssignToken,
  BinaryOpToken,
  OpenParenToken,
  CloseParenToken,
} from "../src/Token";

it("should tokenize assingment", () => {
  expect(lex("let x = 1")).toEqual([
    new AssignToken(),
    new IdentifierToken("x"),
    new EqToken(),
    new NumberToken(1),
  ]);
});

it("should tokenize numerical statement", () => {
  expect(lex("1 + 2 * 3")).toEqual([
    new NumberToken(1),
    new BinaryOpToken("+"),
    new NumberToken(2),
    new BinaryOpToken("*"),
    new NumberToken(3),
  ]);
  expect(lex("(1 + 2) * 3")).toEqual([
    new OpenParenToken(),
    new NumberToken(1),
    new BinaryOpToken("+"),
    new NumberToken(2),
    new CloseParenToken(),
    new BinaryOpToken("*"),
    new NumberToken(3),
  ]);
});
