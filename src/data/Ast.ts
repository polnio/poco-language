// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class Node {}

export class ProgramNode extends Node {
  public constructor(public statements: Node[]) {
    super();
  }
}

export class AssignNode extends Node {
  public constructor(
    public name: string,
    public value: ExpressionNode,
    public isMutable: boolean,
  ) {
    super();
  }
}

export class MutationNode extends Node {
  public constructor(
    public name: string,
    public value: ExpressionNode,
  ) {
    super();
  }
}

export abstract class ExpressionNode extends Node {}

export class BinaryOpNode extends ExpressionNode {
  public constructor(
    public left: Node,
    public op: string,
    public right: Node,
  ) {
    super();
  }
}

export class IdentifierNode extends ExpressionNode {
  public constructor(public name: string) {
    super();
  }
}

export class NumberNode extends ExpressionNode {
  public constructor(public value: number) {
    super();
  }
}

export class BooleanNode extends ExpressionNode {
  public constructor(public value: boolean) {
    super();
  }
}

export class StringNode extends ExpressionNode {
  public constructor(public value: string) {
    super();
  }
}

export class NullNode extends ExpressionNode {}
