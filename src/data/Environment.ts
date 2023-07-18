import type Value from "./Value";

export default class Environment {
  private readonly parent: Environment | undefined;
  private readonly variables: Map<string, Value>;
  private readonly constants: Set<string>;

  public constructor(parent?: Environment | undefined) {
    this.parent = parent;
    this.variables = new Map();
    this.constants = new Set();
  }

  public assign(name: string, value: Value, isMutable: boolean): void {
    if (this.variables.has(name)) {
      throw new Error(`Variable "${name}" already exists`);
    }
    this.variables.set(name, value);
    if (!isMutable) {
      this.constants.add(name);
    }
  }

  public mutate(name: string, value: Value): void {
    if (this.constants.has(name)) {
      throw new Error(`Variable "${name}" already exists and cannot be edited`);
    }
    if (this.variables.has(name)) {
      // if(this.variables.get(name))
      this.variables.set(name, value);
    } else if (this.parent !== undefined) {
      this.parent.mutate(name, value);
    } else {
      throw new Error(`Variable "${name}" does not exist`);
    }
  }

  public get(name: string): Value {
    if (this.variables.has(name)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.variables.get(name)!;
    }
    if (this.parent !== undefined) {
      return this.parent.get(name);
    }
    throw new Error(`Variable "${name}" does not exist`);
  }
}
