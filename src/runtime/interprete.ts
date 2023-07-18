import {
  ProgramNode,
  StringNode,
  type Node,
  BinaryOpNode,
  BooleanNode,
  NullNode,
  NumberNode,
  IdentifierNode,
  AssignNode,
  MutationNode,
} from "../data/Ast";
import Environment from "../data/Environment";
import type Value from "../data/Value";
import {
  BooleanValue,
  NullValue,
  NumberValue,
  StringValue,
} from "../data/Value";
import parse from "./parse";

const numericalOperations: Record<
  string,
  (left: NumberValue, right: NumberValue) => Value
> = {
  "+": (left, right) => new NumberValue(left.value + right.value),
  "-": (left, right) => new NumberValue(left.value - right.value),
  "*": (left, right) => new NumberValue(left.value * right.value),
  "/": (left, right) => {
    if (right.value === 0) {
      throw new Error("Division by zero");
    }
    return new NumberValue(left.value / right.value);
  },
};

function interpreteNode(node: Node, env: Environment): Value {
  if (node instanceof ProgramNode) {
    let result = new NullValue();
    for (const statement of node.statements) {
      result = interpreteNode(statement, env);
    }
    return result;
  }
  if (node instanceof StringNode) {
    return new StringValue(node.value);
  }
  if (node instanceof NumberNode) {
    return new NumberValue(node.value);
  }
  if (node instanceof BooleanNode) {
    return new BooleanValue(node.value);
  }
  if (node instanceof NullNode) {
    return new NullValue();
  }
  if (node instanceof IdentifierNode) {
    return env.get(node.name);
  }
  if (node instanceof AssignNode) {
    env.assign(node.name, interpreteNode(node.value, env), node.isMutable);
    return new NullValue();
  }
  if (node instanceof MutationNode) {
    env.mutate(node.name, interpreteNode(node.value, env));
    return new NullValue();
  }
  if (node instanceof BinaryOpNode) {
    const left = interpreteNode(node.left, env);
    const right = interpreteNode(node.right, env);
    if (left instanceof NumberValue && right instanceof NumberValue) {
      if (!(node.op in numericalOperations)) {
        throw new Error(`Unexpected operation: ${node.op}`);
      }
      return numericalOperations[node.op](left, right);
    }
    throw new Error(
      `Unexpected operation "${node.op}" between ${node.left.constructor.name} and ${node.right.constructor.name}`,
    );
  }
  throw new Error(`Unexpected node type: ${node.constructor.name}`);
}

export default function interprete(srcCode: string): Value {
  const env = new Environment();
  env.assign("pi", new NumberValue(Math.PI), false);
  return interpreteNode(parse(srcCode), env);
}
