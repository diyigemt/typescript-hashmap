// import list from "./LinkedList";
//
// interface LinkedListConstructor {
//   new <E>(): list<E>;
// }
//
// declare let LinkedList: LinkedListConstructor;

interface HashMap<K, V> {
  getSize(): number;
}

interface HashMapConstructor {
  new (): HashMap<any, any>;
  new <K, V>(): HashMap<K, V>;
}

declare let HashMap: HashMapConstructor;

export default HashMap
