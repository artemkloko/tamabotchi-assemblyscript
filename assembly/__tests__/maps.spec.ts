import { UnsortedMap, SortedMap } from "../maps";
import { integer } from "../types";

describe("UnsortedMap", () => {
  it("basics", () => {
    const map = new UnsortedMap<integer, integer>([3, 5, 7], [30, 20, 10]);
    expect<integer[]>(map.keys).toStrictEqual([3, 5, 7]);
    expect<integer[]>(map.values).toStrictEqual([30, 20, 10]);
    expect<boolean>(map.has(3)).toBe(true);
    expect<boolean>(map.has(5)).toBe(true);
    expect<boolean>(map.has(7)).toBe(true);
    expect<integer>(map.get(3)).toBe(30);
    expect<integer>(map.get(5)).toBe(20);
    expect<integer>(map.get(7)).toBe(10);
    expect<boolean>(map.has(9)).toBe(false);
    map.set(9, 100);
    expect<boolean>(map.has(9)).toBe(true);
    expect<integer>(map.get(9)).toBe(100);
    map.set(5, 200);
    expect<integer>(map.get(5)).toBe(200);
  });
});

describe("SortedMap", () => {
  it("basics", () => {
    const map = new SortedMap<integer, integer>([3, 5, 7], [10, 20, 30]);
    expect<integer[]>(map.keys).toStrictEqual([7, 5, 3]);
    expect<integer[]>(map.values).toStrictEqual([30, 20, 10]);
    expect<boolean>(map.has(3)).toBe(true);
    expect<boolean>(map.has(5)).toBe(true);
    expect<boolean>(map.has(7)).toBe(true);
    expect<integer>(map.get(3)).toBe(10);
    expect<integer>(map.get(5)).toBe(20);
    expect<integer>(map.get(7)).toBe(30);
    expect<boolean>(map.has(9)).toBe(false);
    map.set(9, 15);
    expect<boolean>(map.has(9)).toBe(true);
    expect<integer>(map.get(9)).toBe(15);
    expect<integer[]>(map.keys).toStrictEqual([7, 5, 9, 3]);
    expect<integer[]>(map.values).toStrictEqual([30, 20, 15, 10]);
    map.set(5, 200);
    expect<integer>(map.get(5)).toBe(200);
    expect<integer[]>(map.keys).toStrictEqual([5, 7, 9, 3]);
    expect<integer[]>(map.values).toStrictEqual([200, 30, 15, 10]);
  });

  it("set", ()=> {
    const map = new SortedMap<integer, integer>([3], [10]);
    map.set(5, 20);
    expect<integer[]>(map.keys).toStrictEqual([5, 3]);
    expect<integer[]>(map.values).toStrictEqual([20, 10]);
    map.set(3, 30);
    expect<integer[]>(map.keys).toStrictEqual([3, 5]);
    expect<integer[]>(map.values).toStrictEqual([30, 20]);
  })
});
