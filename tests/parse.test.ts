import { describe, expect, it } from "vitest";
import {
  AssignNode,
  BinaryOpNode,
  MutationNode,
  NumberNode,
  ProgramNode,
} from "../src/data/Ast";
import parse from "../src/runtime/parse";

describe("asignments", () => {
  it("should parse constant asignment", () => {
    expect(parse("let x = 1")).toEqual(
      new ProgramNode([new AssignNode("x", new NumberNode(1), false)]),
    );
  });
  it("should parse mutable asignment", () => {
    expect(parse("let mut x = 1")).toEqual(
      new ProgramNode([new AssignNode("x", new NumberNode(1), true)]),
    );
  });
  it("should parse variable mutation", () => {
    expect(parse("let mut x = 1\nx = 2")).toEqual(
      new ProgramNode([
        new AssignNode("x", new NumberNode(1), true),
        new MutationNode("x", new NumberNode(2)),
      ]),
    );
  });
  /* it("should throw error trying to mutate immutable variable", () => {
    expect(() => parse("let x = 1\nx = 2")).toThrow();
  }); */
});

it("should parse numerical statement", () => {
  expect(parse("1 + 2 * 3")).toEqual(
    new ProgramNode([
      new BinaryOpNode(
        new NumberNode(1),
        "+",
        new BinaryOpNode(new NumberNode(2), "*", new NumberNode(3)),
      ),
    ]),
  );
  expect(parse("(1 + 2) * 3")).toEqual(
    new ProgramNode([
      new BinaryOpNode(
        new BinaryOpNode(new NumberNode(1), "+", new NumberNode(2)),
        "*",
        new NumberNode(3),
      ),
    ]),
  );
});
