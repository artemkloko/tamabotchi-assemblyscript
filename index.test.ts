import { add, process_sentence, add_strings } from "./assembly/index";

test("adds 1 + 2 to equal 3", () => {
  expect(add(1, 2)).toBe(3);
});

test("add_strings", () => {
  const result = add_strings("A", "b");
  expect(result).toBe("A b");
});

test("process_sentence", () => {
  expect(process_sentence("b")).toBe("b");
});
