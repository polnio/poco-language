import { readFileSync } from "fs";
import interprete from "./runtime/interprete";

const filename = process.argv[2];
if (filename === undefined) {
  console.error("Please provide a filename");
  process.exit(1);
}

const code = readFileSync(filename, "utf-8");
interprete(code);
