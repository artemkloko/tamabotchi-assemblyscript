// The entry file of your WebAssembly module.

export function add(a: i32, b: i32): i32 {
  return a + b;
}

export function add_strings(a: string, b: string): string {
  return a + " " + b;
}

export function process_sentence(sentence: string):string {
  const a = new Map<string, string>();
  a.set("a", sentence);
  return a.get("a");
}