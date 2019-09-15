import { UnsortedMap, SortedMap } from "./maps";
import { integer, float } from "./types";

export class TransitionMap extends UnsortedMap<
  string,
  SortedMap<string, integer>
> {
  chainLength: integer;

  constructor(chainLength: integer) {
    super();
    this.chainLength = chainLength;
  }

  addWords(words: string[]): string {
    // concat instead of push, so the original array does not change
    words = words.concat(["__END__"]);

    let results: string = " adding " + words.join(",") + "\n";
    let l = words.length - this.chainLength;
    let slice: string[];
    let keyword: string;
    let nextWord: string;
    let nextWords: SortedMap<string, integer>;
    let value: integer;

    for (let i = 0; i < l; i++) {
      slice = words.slice(i, i + this.chainLength);
      keyword = slice.join(" ");
      if (this.has(keyword)) {
        nextWords = this.get(keyword);
      } else {
        nextWords = new SortedMap<string, integer>();
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
  }

  getInitialKeyword(rewards: string[]): string {
    let utilities: float[] = [];
    for (let i = 0, l = this.keys.length; i < l; i++) {
      utilities.push(this.getUtility(this.keys[i], rewards));
    }
    const keysUtilities = new SortedMap<string, float>(
      this.keys.concat([]),
      utilities
    );
    // let r = this.decision(wraps);
    return keysUtilities.keys[0];
  }

  getUtility(keyword: string, rewards: string[]): float {
    var keywordSlice = keyword
      .split(" ")
      .slice(0, this.chainLength - 1)
      .join(" ");

    let r: float = 0.0;
    for (var i = 0, l = rewards.length; i < l; i++) {
      if (keyword.split(" ").indexOf(rewards[i]) > -1) {
        r++;
      }
    }
    // if (typeof this.keywords[keyword] === 'undefined') {
    if (!this.has(keyword)) {
      return r as float;
    }
    let nextWords = this.get(keyword);
    // let nextWordsSum = nextWords.reduce(function(prev, curr) {
    //   return prev + curr[1];
    // }, 0);
    var maxProbWord = nextWords.keys[0];

    var nextKeyword = keywordSlice + " " + maxProbWord;
    var nextKeywordUtility = 0.0 as float;
    if (keyword !== nextKeyword) {
      nextKeywordUtility = this.getUtility(nextKeyword, rewards);
    }

    var g = 0.9 as float;
    // var u = r + g * maxProbWord[1] / nextWordsSum * nextKeywordUtility
    var u = r + g * nextKeywordUtility;
    return u;
  }

  getSentence(keyword: string, rewards: string[]): string {
    let words = keyword.split(" ");
    while (true) {
      let keyword = words.slice(-1 * this.chainLength).join(" ");
      let nextWord = this.getNextWord(keyword, rewards);
      if (nextWord === "__END__" || !nextWord) {
        break;
      }
      words.push(nextWord);
    }
    return words.join(" ");
  }

  getNextWord(keyword: string, rewards: string[]): string {
    var instance = this;
    var keywordSlice = keyword
      .split(" ")
      .slice(0, this.chainLength - 1)
      .join(" ");

    let keys = this.get(keyword).keys;
    let utilities: float[] = [];
    for (let i = 0, l = keys.length; i < l; i++) {
      var nextWord = keys[i];
      var nextKeyword = keywordSlice + " " + nextWord;
      var nextKeywordUtility = 0.0 as float;
      if (keyword !== nextKeyword) {
        nextKeywordUtility = instance.getUtility(nextKeyword, rewards);
      }
      utilities.push(nextKeywordUtility);
    }

    let sortedMap = new SortedMap<string, float>(keys, utilities);

    return sortedMap.keys[0];
  }
}

export class Tamabotchi {
  forwardMap: TransitionMap;
  backwardMap: TransitionMap;

  constructor() {
    this.forwardMap = new TransitionMap(3);
    this.backwardMap = new TransitionMap(3);
  }

  sentenceToWords(sentence: string): string[] {
    let substitute: string[], mod: string, char: string, prev: string;

    // sentence = sentence.replace(/([;,.?!".])/g, ' $1 ')
    substitute = ';,.?!".'.split("");
    mod = "";
    for (let i = 0, l = sentence.length; i < l; i++) {
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
    for (let i = 0, l = sentence.length; i < l; i++) {
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

    const words = sentence.trim().split(" ");
    return words;
  }

  learn(sentence: string): void {
    const words = this.sentenceToWords(sentence);

    var f = this.forwardMap.addWords(words);
    words.reverse();
    var b = this.backwardMap.addWords(words);
  }

  getRewardWords(sentence: string): string[] {
    const words = sentence.split(" ");
    const max: float = ((words.length as float) * 1.0) / 3.0;
    const toKeepCount = Math.ceil(max) as integer;
    const toKeepWords = words
      .sort(function(a, b) {
        // b - a because the biggest length to be first
        return b.length - a.length;
      })
      .slice(0, toKeepCount);
    const rewards: string[] = [];
    for (let i = 0, l = words.length; i < l; i++) {
      if (toKeepWords.indexOf(words[i]) > -1) {
        rewards.push(words[i]);
      }
    }
    return rewards;
  }

  reply(sentence: string): string {
    let substitute: string[], mod: string, char: string, prev: string;

    // sentence = sentence.replace(/[;,.?!".\s]+/g, ' ').trim()
    substitute = ';,.?!". \n\t\r'.split("");
    mod = "";
    for (let i = 0, l = sentence.length; i < l; i++) {
      char = sentence.charAt(i);
      prev = mod.charAt(mod.length - 1);
      if (substitute.indexOf(char) > -1) {
        char = prev !== " " ? " " : "";
      }
      mod += char;
    }
    sentence = mod;

    const rewards = this.getRewardWords(sentence);
    // console.log(`rewards: ${rewards}`);

    const keyword = this.forwardMap.getInitialKeyword(rewards);
    // console.log(`keyword: ${keyword}`);

    if (!keyword) {
      if (rewards.length === 1 && rewards[0] === "") {
        return `What?`;
      }
      var r = Math.floor(Math.random() * rewards.length);
      return `What does "${rewards[r]}" even mean?`;
    }

    let f = this.forwardMap.getSentence(keyword, rewards);
    let b = this.backwardMap.getSentence(
      keyword
        .split(" ")
        .reverse()
        .join(" "),
      rewards.reverse()
    );
    let reply =
      b
        .split(" ")
        .reverse()
        .join(" ") + f.substring(keyword.length);
    // reply = reply.replace(/\s+([;,.?!])/g, "$1 ").replace(/\s+/g, " ");
    return reply;
  }
}
