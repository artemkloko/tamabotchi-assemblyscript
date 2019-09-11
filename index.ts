import { readFileSync } from "fs";
import { instantiateBuffer } from "assemblyscript/lib/loader";

const file = readFileSync(__dirname + "/build/optimized.wasm");
const imports = {};
const assemblyModule = instantiateBuffer(file, imports);

// alter all the exported functions for string usage
Object.keys(assemblyModule).forEach(key => {
  // keep the original
  assemblyModule["_" + key] = assemblyModule[key];
  assemblyModule[key] = (...args) => {
    // if any of the given args is a string, allocate memory for it
    args = args.map(arg =>
      typeof arg === "string" ? assemblyModule.__allocString(arg) : arg
    );
    // execure the original function
    const result = assemblyModule["_" + key](...args);
    // if the result is instance of string, read it from memory
    if (assemblyModule.__instanceof(result, 1)) {
      return assemblyModule.__getString(result);
    } else {
      return result;
    }
  };
});

Object.defineProperty(module, "exports", {
  get: () => assemblyModule
});
