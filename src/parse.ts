import {
  type ExpressionNode,
  IdentifierNode,
  NumberNode,
  ProgramNode,
  type Node,
  BinaryOpNode,
  NullNode,
  StringNode,
  AssignNode,
} from "./Ast";
import type Token from "./Token";
import {
  AssignToken,
  BinaryOpToken,
  EqToken,
  IdentifierToken,
  MutableToken,
  NullToken,
  NumberToken,
  OpenParenToken,
  StringToken,
} from "./Token";
import lex from "./lex";

function safeShiftToken(tokens: Token[]): Token {
  const token = tokens.shift();
  if (token === undefined) {
    throw new Error("Unexpected end of input");
  }
  return token;
}

/* Order of prescidence:
 * - Expression
 *   - Multiplication / Division
 *   - Addition / Subtraction
 *   - Primary (Identifier / Number)
 * - Assignment
 * - Statement
 * - Program
 */

export default function parse(srcCode: string): ProgramNode {
  const tokens = lex(srcCode);
  const program = new ProgramNode([]);
  while (tokens.length > 0) {
    program.statements.push(parseStatement(tokens));
  }
  return program;
}

function parseStatement(tokens: Token[]): Node {
  if (tokens[0] instanceof AssignToken) {
    return parseAssignment(tokens);
  }
  return parseExpression(tokens);
}

function parseExpression(tokens: Token[]): ExpressionNode {
  return parseAdditionExpression(tokens);
}

function parseAssignment(tokens: Token[]): Node {
  tokens.shift();
  const isMutable = tokens[0] instanceof MutableToken;
  if (isMutable) {
    tokens.shift();
  }
  const nameToken = safeShiftToken(tokens);
  if (!(nameToken instanceof IdentifierToken)) {
    throw new Error("Unexpected token: " + nameToken.constructor.name);
  }
  if (tokens[0] instanceof EqToken) {
    tokens.shift();
    const valueNode = parseExpression(tokens);
    return new AssignNode(nameToken.value, valueNode, isMutable);
  }
  return new AssignNode(nameToken.value, new NullNode(), isMutable);
}

function parseAdditionExpression(tokens: Token[]): ExpressionNode {
  let left = parseMultiplicationExpression(tokens);
  const currentToken = tokens[0];
  if (
    currentToken instanceof BinaryOpToken &&
    ["+", "-"].includes(currentToken.value)
  ) {
    tokens.shift();
    left = new BinaryOpNode(
      left,
      currentToken.value,
      parseMultiplicationExpression(tokens),
    );
  }
  return left;
}

function parseMultiplicationExpression(tokens: Token[]): ExpressionNode {
  let left = parsePrimaryExpression(tokens);
  const currentToken = tokens[0];

  if (
    currentToken instanceof BinaryOpToken &&
    ["*", "/"].includes(currentToken.value)
  ) {
    tokens.shift();
    left = new BinaryOpNode(
      left,
      currentToken.value,
      parsePrimaryExpression(tokens),
    );
  }

  return left;
}

function parsePrimaryExpression(tokens: Token[]): ExpressionNode {
  const token = safeShiftToken(tokens);
  if (token instanceof IdentifierToken) {
    return new IdentifierNode(token.value);
  }
  if (token instanceof NumberToken) {
    return new NumberNode(token.value);
  }
  if (token instanceof NullToken) {
    return new NullNode();
  }
  if (token instanceof StringToken) {
    return new StringNode(token.value);
  }
  if (token instanceof OpenParenToken) {
    const value = parseExpression(tokens);
    tokens.shift();
    return value;
  }
  throw new Error(`Unexpected token: ${token.constructor.name}`);
}
