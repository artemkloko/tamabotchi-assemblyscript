import { integer } from "./types";

export class SortedMap<KeyType, ValueType extends number> {
  keys: KeyType[];
  values: ValueType[];

  constructor(keys: KeyType[] = [], values: ValueType[] = []) {
    if (!!keys && !!values) {
      let tempKey: KeyType, tempValue: ValueType;
      for (let i = 0, il = values.length; i < il; i++) {
        for (let j = i + 1, jl = values.length; j < jl; j++) {
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

  get(key: KeyType): ValueType {
    const index = this.keys.indexOf(key);
    return this.values[index];
  }

  set(setKey: KeyType, setValue: ValueType): void {
    // if key already exists - remove key value
    const index = this.keys.indexOf(setKey);
    const l = this.keys.length;
    if (index > -1) {
      for (let i = index; i < l - 1; i++) {
        this.keys[i] = this.keys[i + 1];
        this.values[i] = this.values[i + 1];
      }
      this.keys.pop();
      this.values.pop();
      // this.keys.splice(index, 1);
      // this.values.splice(index, 1);
    }

    for (let i = this.values.length; i > -1; i--) {
      if (i === 0 || this.values[i - 1] > setValue) {
        this.keys[i] = setKey;
        this.values[i] = setValue;
        break;
      } else {
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
  }

  has(key: KeyType): boolean {
    return this.keys.indexOf(key) > -1;
  }

  map<NewValueType extends number>(
    callback: (key: KeyType, value: ValueType) => NewValueType
  ): SortedMap<KeyType, NewValueType> {
    const values: NewValueType[] = [];
    let value: NewValueType;
    for (let i = 0, il = this.keys.length; i < il; i++) {
      value = callback(this.keys[i], this.values[i]);
      values.push(value);
    }
    return new SortedMap<KeyType, NewValueType>(this.keys.concat([]), values);
  }
}

export class UnsortedMap<KeyType, ValueType> {
  keys: KeyType[];
  values: ValueType[];

  constructor(keys: KeyType[] = [], values: ValueType[] = []) {
    this.keys = keys;
    this.values = values;
  }

  get(key: KeyType): ValueType {
    const index = this.keys.indexOf(key);
    return this.values[index];
  }

  set(setKey: KeyType, setValue: ValueType): void {
    let index = this.keys.indexOf(setKey);
    if (index === -1) {
      index = this.keys.length;
      this.keys[index] = setKey;
    }
    this.values[index] = setValue;
  }

  has(key: KeyType): boolean {
    return this.keys.indexOf(key) > -1;
  }

  map<NewValueType>(
    callback: (key: KeyType, value: ValueType) => NewValueType
  ): UnsortedMap<KeyType, NewValueType> {
    const values: NewValueType[] = [];
    let value: NewValueType;
    for (let i = 0, il = this.keys.length; i < il; i++) {
      value = callback(this.keys[i], this.values[i]);
      values.push(value);
    }
    return new UnsortedMap<KeyType, NewValueType>(this.keys.concat([]), values);
  }
}

export class UnsortedIntegerMap extends UnsortedMap<integer, integer> {}
