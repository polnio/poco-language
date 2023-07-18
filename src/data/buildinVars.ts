import type Value from "./Value";
import { FunctionValue, NullValue, NumberValue } from "./Value";

const buildinVars = {
  pi: new NumberValue(Math.PI),
  e: new NumberValue(Math.E),
  sin: new FunctionValue<[NumberValue], NumberValue>(
    (n) => new NumberValue(Math.sin(n.value)),
  ),
  cos: new FunctionValue<[NumberValue], NumberValue>(
    (n) => new NumberValue(Math.cos(n.value)),
  ),
  tan: new FunctionValue<[NumberValue], NumberValue>(
    (n) => new NumberValue(Math.tan(n.value)),
  ),
  abs: new FunctionValue<[NumberValue], NumberValue>(
    (n) => new NumberValue(Math.abs(n.value)),
  ),
  floor: new FunctionValue<[NumberValue], NumberValue>(
    (n) => new NumberValue(Math.floor(n.value)),
  ),
  ceil: new FunctionValue<[NumberValue], NumberValue>(
    (n) => new NumberValue(Math.ceil(n.value)),
  ),
  round: new FunctionValue<[NumberValue], NumberValue>(
    (n) => new NumberValue(Math.round(n.value)),
  ),
  log: new FunctionValue<[NumberValue], NumberValue>(
    (n) => new NumberValue(Math.log(n.value)),
  ),
  exp: new FunctionValue<[NumberValue], NumberValue>(
    (n) => new NumberValue(Math.exp(n.value)),
  ),
  sqrt: new FunctionValue<[NumberValue], NumberValue>(
    (n) => new NumberValue(Math.sqrt(n.value)),
  ),
  log10: new FunctionValue<[NumberValue], NumberValue>(
    (n) => new NumberValue(Math.log10(n.value)),
  ),
  add: new FunctionValue<NumberValue[], NumberValue>(
    (...args) => new NumberValue(args.reduce((acc, b) => acc + b.value, 0)),
  ),
  println: new FunctionValue<[Value], NullValue>((...args) => {
    console.log(...args.map((a) => a.value));
    return new NullValue();
  }),
} satisfies Record<string, Value>;

export default buildinVars;
