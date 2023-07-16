// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default abstract class Token {}

export class NumberToken extends Token {
  public constructor(public value: number) {
    super();
  }
}

export class StringToken extends Token {
  public constructor(public value: string) {
    super();
  }
}

export class AssignToken extends Token {}

export class MutableToken extends Token {}

export class IdentifierToken extends Token {
  public constructor(public value: string) {
    super();
  }
}

export class BooleanToken extends Token {
  public constructor(public value: boolean) {
    super();
  }
}

export class BinaryOpToken extends Token {
  public constructor(public value: string) {
    super();
  }
}

export class NullToken extends Token {}

export class OpenParenToken extends Token {}

export class CloseParenToken extends Token {}

export class EqToken extends BinaryOpToken {
  public constructor() {
    super("=");
  }
}
