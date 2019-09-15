import { UnsortedMap, SortedMap } from "./maps";
import { integer, float } from "./types";
export declare class TransitionMap extends UnsortedMap<string, SortedMap<string, integer>> {
    chainLength: integer;
    constructor(chainLength: integer);
    addWords(words: string[]): string;
    getInitialKeyword(rewards: string[]): string;
    getUtility(keyword: string, rewards: string[]): float;
    getSentence(keyword: string, rewards: string[]): string;
    getNextWord(keyword: string, rewards: string[]): string;
}
export declare class Tamabotchi {
    forwardMap: TransitionMap;
    backwardMap: TransitionMap;
    constructor();
    sentenceToWords(sentence: string): string[];
    learn(sentence: string): void;
    getRewardWords(sentence: string): string[];
    reply(sentence: string): string;
}
