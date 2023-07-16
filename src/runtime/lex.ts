import type Token from "../data/Token";
import {
  AssignToken,
  BinaryOpToken,
  BooleanToken,
  CloseParenToken,
  EqToken,
  IdentifierToken,
  MutableToken,
  NumberToken,
  OpenParenToken,
  StringToken,
} from "../data/Token";

const keywordsToToken: Record<string, Token> = {
  let: new AssignToken(),
  true: new BooleanToken(true),
  false: new BooleanToken(false),
  mut: new MutableToken(),
};

export default function lex(srcCode: string): Token[] {
  const tokens: Token[] = [];
  const srcChars = srcCode.split("");

  while (srcChars.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const char = srcChars.shift()!;
    if (/^\s$/.test(char)) {
      continue;
    }
    if (char === "(") {
      tokens.push(new OpenParenToken());
    } else if (char === ")") {
      tokens.push(new CloseParenToken());
    } else if (char === "=") {
      tokens.push(new EqToken());
    } else if (["+", "-", "*", "/", "%"].includes(char)) {
      tokens.push(new BinaryOpToken(char));
    } else if (/^["']$/.test(char)) {
      let string = char;
      while (srcChars[0] !== char) {
        const nextChar = srcChars.shift();
        if (nextChar === undefined) {
          throw new Error("Unexpected end of input");
        }
        string += nextChar;
      }
      tokens.push(new StringToken(string));
    } else if (/^\d$/.test(char)) {
      let numberString = char;
      while (/^\d$/.test(srcChars[0])) {
        const nextChar = srcChars.shift();
        if (nextChar === undefined) {
          throw new Error("Unexpected end of input");
        }
        numberString += nextChar;
      }
      tokens.push(new NumberToken(Number(numberString)));
    } else if (/^[a-zA-Z]$/.test(char)) {
      let textString = char;
      while (/^[a-zA-Z0-9]$/.test(srcChars[0])) {
        const nextChar = srcChars.shift();
        if (nextChar === undefined) {
          throw new Error("Unexpected end of input");
        }
        textString += nextChar;
      }
      tokens.push(
        keywordsToToken[textString] ?? new IdentifierToken(textString),
      );
    } else {
      throw new Error(`Unexpected character: ${char}`);
    }
  }

  return tokens;
}
