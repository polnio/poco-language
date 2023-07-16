export default abstract class Value {
  public value: unknown;
}

export class NumberValue extends Value {
  public constructor(public value: number) {
    super();
  }
}

export class StringValue extends Value {
  public constructor(public value: string) {
    super();
  }
}

export class BooleanValue extends Value {
  public constructor(public value: boolean) {
    super();
  }
}

export class NullValue extends Value {
  public constructor() {
    super();
    this.value = null;
  }
}
