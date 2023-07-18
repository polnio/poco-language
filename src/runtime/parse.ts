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
  MutationNode,
  FunctionCallNode,
} from "../data/Ast";
import type Token from "../data/Token";
import {
  AssignToken,
  BinaryOpToken,
  CloseParenToken,
  EqToken,
  ExpressionToken,
  IdentifierToken,
  MutableToken,
  NewLineToken,
  NullToken,
  NumberToken,
  OpenParenToken,
  StringToken,
} from "../data/Token";
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
    if (tokens[0] instanceof NewLineToken) {
      tokens.shift();
      continue;
    }
    program.statements.push(parseStatement(tokens));
  }
  return program;
}

function parseStatement(tokens: Token[]): Node {
  if (tokens[0] instanceof AssignToken) {
    return parseAssignment(tokens);
  }
  if (tokens[1] instanceof EqToken) {
    return parseMutation(tokens);
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

function parseMutation(tokens: Token[]): Node {
  const identifierToken = safeShiftToken(tokens);
  if (!(identifierToken instanceof IdentifierToken)) {
    throw new Error("Unexpected token: " + identifierToken.constructor.name);
  }
  if (!(tokens[0] instanceof EqToken)) {
    throw new Error("Unexpected token: " + tokens[0].constructor.name);
  }
  tokens.shift();
  const valueNode = parseExpression(tokens);
  return new MutationNode(identifierToken.value, valueNode);
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
    if (tokens[0] instanceof ExpressionToken) {
      const args: ExpressionNode[] = [];
      while (!(tokens.length === 0 || tokens[0] instanceof NewLineToken)) {
        if (tokens[0] instanceof OpenParenToken) {
          const innerParenTokens: Token[] = [];
          while (!(tokens[0] instanceof CloseParenToken)) {
            innerParenTokens.push(safeShiftToken(tokens));
          }
          args.push(parseExpression(innerParenTokens));
        } else {
          args.push(parsePrimaryExpression([tokens[0]]));
        }
        tokens.shift();
      }
      return new FunctionCallNode(token.value, args);
    }
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
  // return new NullNode();
  throw new Error(`Unexpected token: ${token.constructor.name}`);
}
