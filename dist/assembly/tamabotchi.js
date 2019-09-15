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
var maps_1 = require("./maps");
var TransitionMap = /** @class */ (function (_super) {
    __extends(TransitionMap, _super);
    function TransitionMap(chainLength) {
        var _this = _super.call(this) || this;
        _this.chainLength = chainLength;
        return _this;
    }
    TransitionMap.prototype.addWords = function (words) {
        // concat instead of push, so the original array does not change
        words = words.concat(["__END__"]);
        var results = " adding " + words.join(",") + "\n";
        var l = words.length - this.chainLength;
        var slice;
        var keyword;
        var nextWord;
        var nextWords;
        var value;
        for (var i = 0; i < l; i++) {
            slice = words.slice(i, i + this.chainLength);
            keyword = slice.join(" ");
            if (this.has(keyword)) {
                nextWords = this.get(keyword);
            }
            else {
                nextWords = new maps_1.SortedMap();
            }
            nextWord = words[i + this.chainLength];
            value = 0;
            if (nextWords.has(nextWord)) {
                value = nextWords.get(nextWord);
            }
            value++;
            nextWords.set(nextWord, value);
            this.set(keyword, nextWords);
            results += keyword + "[" + nextWord + "]\n";
        }
        return results;
    };
    TransitionMap.prototype.getInitialKeyword = function (rewards) {
        var utilities = [];
        for (var i = 0, l = this.keys.length; i < l; i++) {
            utilities.push(this.getUtility(this.keys[i], rewards));
        }
        var keysUtilities = new maps_1.SortedMap(this.keys.concat([]), utilities);
        // let r = this.decision(wraps);
        return keysUtilities.keys[0];
    };
    TransitionMap.prototype.getUtility = function (keyword, rewards) {
        var keywordSlice = keyword
            .split(" ")
            .slice(0, this.chainLength - 1)
            .join(" ");
        var r = 0.0;
        for (var i = 0, l = rewards.length; i < l; i++) {
            if (keyword.split(" ").indexOf(rewards[i]) > -1) {
                r++;
            }
        }
        // if (typeof this.keywords[keyword] === 'undefined') {
        if (!this.has(keyword)) {
            return r;
        }
        var nextWords = this.get(keyword);
        // let nextWordsSum = nextWords.reduce(function(prev, curr) {
        //   return prev + curr[1];
        // }, 0);
        var maxProbWord = nextWords.keys[0];
        var nextKeyword = keywordSlice + " " + maxProbWord;
        var nextKeywordUtility = 0.0;
        if (keyword !== nextKeyword) {
            nextKeywordUtility = this.getUtility(nextKeyword, rewards);
        }
        var g = 0.9;
        // var u = r + g * maxProbWord[1] / nextWordsSum * nextKeywordUtility
        var u = r + g * nextKeywordUtility;
        return u;
    };
    TransitionMap.prototype.getSentence = function (keyword, rewards) {
        var words = keyword.split(" ");
        while (true) {
            var keyword_1 = words.slice(-1 * this.chainLength).join(" ");
            var nextWord = this.getNextWord(keyword_1, rewards);
            if (nextWord === "__END__" || !nextWord) {
                break;
            }
            words.push(nextWord);
        }
        return words.join(" ");
    };
    TransitionMap.prototype.getNextWord = function (keyword, rewards) {
        var instance = this;
        var keywordSlice = keyword
            .split(" ")
            .slice(0, this.chainLength - 1)
            .join(" ");
        var keys = this.get(keyword).keys;
        var utilities = [];
        for (var i = 0, l = keys.length; i < l; i++) {
            var nextWord = keys[i];
            var nextKeyword = keywordSlice + " " + nextWord;
            var nextKeywordUtility = 0.0;
            if (keyword !== nextKeyword) {
                nextKeywordUtility = instance.getUtility(nextKeyword, rewards);
            }
            utilities.push(nextKeywordUtility);
        }
        var sortedMap = new maps_1.SortedMap(keys, utilities);
        return sortedMap.keys[0];
    };
    return TransitionMap;
}(maps_1.UnsortedMap));
exports.TransitionMap = TransitionMap;
var Tamabotchi = /** @class */ (function () {
    function Tamabotchi() {
        this.forwardMap = new TransitionMap(3);
        this.backwardMap = new TransitionMap(3);
    }
    Tamabotchi.prototype.sentenceToWords = function (sentence) {
        var substitute, mod, char, prev;
        // sentence = sentence.replace(/([;,.?!".])/g, ' $1 ')
        substitute = ';,.?!".'.split("");
        mod = "";
        for (var i = 0, l = sentence.length; i < l; i++) {
            char = sentence.charAt(i);
            if (substitute.indexOf(char) > -1) {
                char = " " + char + " ";
            }
            mod += char;
        }
        sentence = mod;
        // sentence = sentence.replace(/\s+/g, ' ')
        substitute = " \n\t\r".split("");
        mod = "";
        for (var i = 0, l = sentence.length; i < l; i++) {
            char = sentence.charAt(i);
            if (i > 0) {
                prev = sentence.charAt(i - 1);
                if (substitute.indexOf(char) > -1 && substitute.indexOf(prev) > -1) {
                    char = "";
                }
            }
            mod += char;
        }
        sentence = mod;
        var words = sentence.trim().split(" ");
        return words;
    };
    Tamabotchi.prototype.learn = function (sentence) {
        var words = this.sentenceToWords(sentence);
        var f = this.forwardMap.addWords(words);
        words.reverse();
        var b = this.backwardMap.addWords(words);
    };
    Tamabotchi.prototype.getRewardWords = function (sentence) {
        var words = sentence.split(" ");
        var max = (words.length * 1.0) / 3.0;
        var toKeepCount = Math.ceil(max);
        var toKeepWords = words
            .sort(function (a, b) {
            // b - a because the biggest length to be first
            return b.length - a.length;
        })
            .slice(0, toKeepCount);
        var rewards = [];
        for (var i = 0, l = words.length; i < l; i++) {
            if (toKeepWords.indexOf(words[i]) > -1) {
                rewards.push(words[i]);
            }
        }
        return rewards;
    };
    Tamabotchi.prototype.reply = function (sentence) {
        var substitute, mod, char, prev;
        // sentence = sentence.replace(/[;,.?!".\s]+/g, ' ').trim()
        substitute = ';,.?!". \n\t\r'.split("");
        mod = "";
        for (var i = 0, l = sentence.length; i < l; i++) {
            char = sentence.charAt(i);
            prev = mod.charAt(mod.length - 1);
            if (substitute.indexOf(char) > -1) {
                char = prev !== " " ? " " : "";
            }
            mod += char;
        }
        sentence = mod;
        var rewards = this.getRewardWords(sentence);
        // console.log(`rewards: ${rewards}`);
        var keyword = this.forwardMap.getInitialKeyword(rewards);
        // console.log(`keyword: ${keyword}`);
        if (!keyword) {
            if (rewards.length === 1 && rewards[0] === "") {
                return "What?";
            }
            var r = Math.floor(Math.random() * rewards.length);
            return "What does \"" + rewards[r] + "\" even mean?";
        }
        var f = this.forwardMap.getSentence(keyword, rewards);
        var b = this.backwardMap.getSentence(keyword
            .split(" ")
            .reverse()
            .join(" "), rewards.reverse());
        var reply = b
            .split(" ")
            .reverse()
            .join(" ") + f.substring(keyword.length);
        // reply = reply.replace(/\s+([;,.?!])/g, "$1 ").replace(/\s+/g, " ");
        return reply;
    };
    return Tamabotchi;
}());
exports.Tamabotchi = Tamabotchi;
