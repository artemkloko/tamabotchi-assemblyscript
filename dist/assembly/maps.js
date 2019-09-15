"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var SortedMap = /** @class */ (function () {
    function SortedMap(keys, values) {
        if (keys === void 0) { keys = []; }
        if (values === void 0) { values = []; }
        if (!!keys && !!values) {
            var tempKey = void 0, tempValue = void 0;
            for (var i = 0, il = values.length; i < il; i++) {
                for (var j = i + 1, jl = values.length; j < jl; j++) {
                    if (values[i] < values[j]) {
                        tempValue = values[j];
                        values[j] = values[i];
                        values[i] = tempValue;
                        tempKey = keys[j];
                        keys[j] = keys[i];
                        keys[i] = tempKey;
                    }
                }
            }
        }
        this.keys = keys;
        this.values = values;
    }
    SortedMap.prototype.get = function (key) {
        var index = this.keys.indexOf(key);
        return this.values[index];
    };
    SortedMap.prototype.set = function (setKey, setValue) {
        // if key already exists - remove key value
        var index = this.keys.indexOf(setKey);
        var l = this.keys.length;
        if (index > -1) {
            for (var i = index; i < l - 1; i++) {
                this.keys[i] = this.keys[i + 1];
                this.values[i] = this.values[i + 1];
            }
            this.keys.pop();
            this.values.pop();
            // this.keys.splice(index, 1);
            // this.values.splice(index, 1);
        }
        for (var i = this.values.length; i > -1; i--) {
            if (i === 0 || this.values[i - 1] > setValue) {
                this.keys[i] = setKey;
                this.values[i] = setValue;
                break;
            }
            else {
                this.keys[i] = this.keys[i - 1];
                this.values[i] = this.values[i - 1];
            }
        }
        // let setIndex = 0;
        // for (let i = 0, l = this.values.length; i < l; i++) {
        //   if (this.values[i] > setValue) {
        //     setIndex = i + 1;
        //   }
        // }
        // this.keys = this.keys
        //   .slice(0, setIndex)
        //   .concat([setKey])
        //   .concat(this.keys.slice(setIndex));
        // this.values = this.values
        //   .slice(0, setIndex)
        //   .concat([setValue])
        //   .concat(this.values.slice(setIndex));
    };
    SortedMap.prototype.has = function (key) {
        return this.keys.indexOf(key) > -1;
    };
    SortedMap.prototype.map = function (callback) {
        var values = [];
        var value;
        for (var i = 0, il = this.keys.length; i < il; i++) {
            value = callback(this.keys[i], this.values[i]);
            values.push(value);
        }
        return new SortedMap(this.keys.concat([]), values);
    };
    return SortedMap;
}());
exports.SortedMap = SortedMap;
var UnsortedMap = /** @class */ (function () {
    function UnsortedMap(keys, values) {
        if (keys === void 0) { keys = []; }
        if (values === void 0) { values = []; }
        this.keys = keys;
        this.values = values;
    }
    UnsortedMap.prototype.get = function (key) {
        var index = this.keys.indexOf(key);
        return this.values[index];
    };
    UnsortedMap.prototype.set = function (setKey, setValue) {
        var index = this.keys.indexOf(setKey);
        if (index === -1) {
            index = this.keys.length;
            this.keys[index] = setKey;
        }
        this.values[index] = setValue;
    };
    UnsortedMap.prototype.has = function (key) {
        return this.keys.indexOf(key) > -1;
    };
    UnsortedMap.prototype.map = function (callback) {
        var values = [];
        var value;
        for (var i = 0, il = this.keys.length; i < il; i++) {
            value = callback(this.keys[i], this.values[i]);
            values.push(value);
        }
        return new UnsortedMap(this.keys.concat([]), values);
    };
    return UnsortedMap;
}());
exports.UnsortedMap = UnsortedMap;
var UnsortedIntegerMap = /** @class */ (function (_super) {
    __extends(UnsortedIntegerMap, _super);
    function UnsortedIntegerMap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UnsortedIntegerMap;
}(UnsortedMap));
exports.UnsortedIntegerMap = UnsortedIntegerMap;
