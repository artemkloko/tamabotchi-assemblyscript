import { readFileSync } from "fs";
import { instantiateBuffer } from "assemblyscript/lib/loader";
import * as assembly from "./assembly";

const env = process.env.NODE_ENV || "dev";
const path = /.ts$/.test(__filename) ? __dirname : __dirname + '/..'
const wasm = env === "dev" ? "/build/optimized.wasm" : "/build/untouched.wasm";
const file = readFileSync(path + wasm);
const imports = {};
const assemblyModule = instantiateBuffer<typeof assembly>(file, imports);

export class Tamabotchi {
  private tamabotchi: assembly.Tamabotchi;

  constructor() {
    this.tamabotchi = new assemblyModule.Tamabotchi();
  }

  learn(sentence: string) {
    const aSentence = assemblyModule.__allocString(sentence);
    this.tamabotchi.learn.call(this.tamabotchi, aSentence);
  }

  reply(word: string): string {
    const aWord = assemblyModule.__allocString(word);
    const result = this.tamabotchi.reply.call(this.tamabotchi, aWord);
    return assemblyModule.__getString(result);
  }
}