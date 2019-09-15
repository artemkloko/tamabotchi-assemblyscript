import { readFileSync } from "fs";
import { instantiateBuffer } from "assemblyscript/lib/loader";
import * as assembly from "./assembly";
export { Tamabotchi } from "./assembly";

const file = readFileSync(__dirname + "/build/untouched.wasm");
const imports = {};
const assemblyModule = instantiateBuffer<typeof assembly>(file, imports);

class Tamabotchi {
  tamabotchi: assembly.Tamabotchi;

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

Object.defineProperty(module, "exports", {
  get: () => ({ Tamabotchi })
});
