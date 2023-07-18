// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default abstract class Token {}

export class NewLineToken extends Token {}

export class AssignToken extends Token {}

export class MutableToken extends Token {}

export abstract class ExpressionToken extends Token {}

export class NumberToken extends ExpressionToken {
  public constructor(public value: number) {
    super();
  }
}

export class StringToken extends ExpressionToken {
  public constructor(public value: string) {
    super();
  }
}

export class IdentifierToken extends ExpressionToken {
  public constructor(public value: string) {
    super();
  }
}

export class BooleanToken extends ExpressionToken {
  public constructor(public value: boolean) {
    super();
  }
}

export class NullToken extends ExpressionToken {}

export class OpenParenToken extends ExpressionToken {}

export class CloseParenToken extends Token {}

export class BinaryOpToken extends Token {
  public constructor(public value: string) {
    super();
  }
}

export class EqToken extends BinaryOpToken {
  public constructor() {
    super("=");
  }
}
