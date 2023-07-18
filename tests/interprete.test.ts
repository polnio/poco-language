import { describe, expect, it } from "vitest";
import interprete from "../src/runtime/interprete";
import { NumberValue } from "../src/data/Value";

describe("numerical statement", () => {
  it("should parse basic operations", () => {
    expect(interprete("1 + 2 * 3")).toEqual(new NumberValue(7));
  });
});

describe("variables", () => {
  it("should resolve build-in variables", () => {
    expect(interprete("pi")).toEqual(new NumberValue(Math.PI));
    expect(interprete("pi + 1")).toEqual(new NumberValue(Math.PI + 1));
  });
});

describe("assignment", () => {
  it("should interprete assignment", () => {
    expect(interprete("let x = 1\nx + 1")).toEqual(new NumberValue(2));
  });
  it("should interprete mutable assignment", () => {
    expect(interprete("let mut x = 1\nx + 1")).toEqual(new NumberValue(2));
  });
  it("should throw error trying to mutate immutable variable", () => {
    expect(() => interprete("let x = 1\nx = 2")).toThrow();
  });
  it("should mutate variable", () => {
    expect(interprete("let mut x = 1\nx = x + 1\nx")).toEqual(
      new NumberValue(2),
    );
  });
});

describe("function calls", () => {
  it("should interprete function call", () => {
    expect(interprete("add 2 3")).toEqual(new NumberValue(5));
  });
});
