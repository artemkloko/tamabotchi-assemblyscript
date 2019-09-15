"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var loader_1 = require("assemblyscript/lib/loader");
var env = process.env.NODE_ENV || "dev";
var path = /.ts$/.test(__filename) ? __dirname : __dirname + '/..';
var wasm = env === "dev" ? "/build/optimized.wasm" : "/build/untouched.wasm";
var file = fs_1.readFileSync(path + wasm);
var imports = {};
var assemblyModule = loader_1.instantiateBuffer(file, imports);
var Tamabotchi = /** @class */ (function () {
    function Tamabotchi() {
        this.tamabotchi = new assemblyModule.Tamabotchi();
    }
    Tamabotchi.prototype.learn = function (sentence) {
        var aSentence = assemblyModule.__allocString(sentence);
        this.tamabotchi.learn.call(this.tamabotchi, aSentence);
    };
    Tamabotchi.prototype.reply = function (word) {
        var aWord = assemblyModule.__allocString(word);
        var result = this.tamabotchi.reply.call(this.tamabotchi, aWord);
        return assemblyModule.__getString(result);
    };
    return Tamabotchi;
}());
exports.Tamabotchi = Tamabotchi;
