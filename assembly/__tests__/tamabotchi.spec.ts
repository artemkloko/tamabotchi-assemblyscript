import { Tamabotchi, TransitionMap } from "../tamabotchi";

describe("Tamabotchi", () => {
  it("getRewardWords", () => {
    const tamabotchi = new Tamabotchi();
    const result1 = tamabotchi.getRewardWords("a bb c");
    expect<string>(result1[0]).toBe("bb");
    const result2 = tamabotchi.getRewardWords("a");
    expect<string>(result2[0]).toBe("a");
  });

  it("learn", () => {
    const tamabotchi = new Tamabotchi();
    tamabotchi.learn("a b c d");
    tamabotchi.learn("g h i j");
    const reply1 = tamabotchi.reply("b")
    expect<string>(reply1).toBe("a b c d")
    const reply2 = tamabotchi.reply("i");
    expect<string>(reply2).toBe("g h i j");
  });
});


describe("TransitionMap", () => {

  it("getInitialKeyword", () => {
    const transitionMap = new TransitionMap(3);
    transitionMap.addWords(["q", "w", "e", "r"])
    transitionMap.addWords(["a", "s", "d", "f"])
    let result = transitionMap.getInitialKeyword(["w"]);
    expect<string>(result).toBe("q w e");
    result = transitionMap.getInitialKeyword(["s"]);
    expect<string>(result).toBe("a s d");
  });

  it("getSentence", () => {
    const transitionMap = new TransitionMap(3);
    transitionMap.addWords(["q", "w", "e", "r"])
    transitionMap.addWords(["a", "s", "d", "f"])
    let result = transitionMap.getSentence("q w e", ["e"]);
    expect<string>(result).toBe("q w e r");
    result = transitionMap.getSentence("a s d", ["s"]);
    expect<string>(result).toBe("a s d f");
  });
});
