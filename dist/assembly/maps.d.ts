import { integer } from "./types";
export declare class SortedMap<KeyType, ValueType extends number> {
    keys: KeyType[];
    values: ValueType[];
    constructor(keys?: KeyType[], values?: ValueType[]);
    get(key: KeyType): ValueType;
    set(setKey: KeyType, setValue: ValueType): void;
    has(key: KeyType): boolean;
    map<NewValueType extends number>(callback: (key: KeyType, value: ValueType) => NewValueType): SortedMap<KeyType, NewValueType>;
}
export declare class UnsortedMap<KeyType, ValueType> {
    keys: KeyType[];
    values: ValueType[];
    constructor(keys?: KeyType[], values?: ValueType[]);
    get(key: KeyType): ValueType;
    set(setKey: KeyType, setValue: ValueType): void;
    has(key: KeyType): boolean;
    map<NewValueType>(callback: (key: KeyType, value: ValueType) => NewValueType): UnsortedMap<KeyType, NewValueType>;
}
export declare class UnsortedIntegerMap extends UnsortedMap<integer, integer> {
}
