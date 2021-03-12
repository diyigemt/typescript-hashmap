class HashMapNode<K, V> {
  hash: number;
  key: K;
  value: V;
  next: HashMapNode<K, V>;

  constructor(hash: number, key: K, value: V, next: HashMapNode<K, V>) {
    this.hash = hash;
    this.key = key;
    this.value = value;
    this.next = next;
  }

  public getKey(): K { return this.key }
  public getVale(): V { return this.value }
  public toString(): string { return this.key + "=" + this.value; }
  // a simple implementation
  public hashCode(): string {
    const str = this.toString();
    let h = 0, off = 0;
    const len = str.length;
    for (let i = 0; i < len; i++) {
      h = 31 * h + str.charCodeAt(off++);
    }
    const t = -2147483648*2;
    while (h > 2147483648) {
      h += t;
    }
    return h.toString();
  }

  public setValue(newValue: V): V {
    const oldValue: V = this.value;
    this.value = newValue;
    return oldValue;
  }

  public equals(o: Object): boolean {
    if (o === this) return true;
    if (o instanceof HashMapNode) {
      const e: HashMapNode<any, any> = o as HashMapNode<any, any>;
      if (this.key === e.getKey() && this.value === e.getVale()) return true;
    }
    return false;
  }
}

class IllegalArgumentException extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export default class HashMap<K, V> {
  private static readonly serialVersionUID: number = 362498820763181265;
  static readonly DEFAULT_INITIAL_CAPACITY: number = 1 << 4;
  static readonly MAXIMUM_CAPACITY: number = 1 << 30;
  static readonly DEFAULT_LOAD_FACTOR: number = 0.75;
  static readonly TREEIFY_THRESHOLD: number = 8;
  static readonly UNTREEIFY_THRESHOLD: number = 6;
  static readonly MIN_TREEIFY_CAPACITY: number = 64;

  public static numberOfLeadingZeros(i: number): number {
    if (i <= 0)
      return i == 0 ? 32 : 0;
    let n = 31;
    if (i >= 1 << 16) { n -= 16; i >>>= 16; }
    if (i >= 1 <<  8) { n -=  8; i >>>=  8; }
    if (i >= 1 <<  4) { n -=  4; i >>>=  4; }
    if (i >= 1 <<  2) { n -=  2; i >>>=  2; }
    return n - (i >>> 1);
  }

  static hash(key: Object): number {
    let h: number;
    return (key === null) ? 0 : (h = this.hash(key)) ^ (h >>> 16);
  }

  static tableSizeFor(cap: number): number {
    let n = -1 >>> HashMap.numberOfLeadingZeros(cap - 1);
    return (n < 0) ? 1 : (n >= HashMap.MAXIMUM_CAPACITY) ? HashMap.MAXIMUM_CAPACITY : n + 1;
  }

  //内容
  table: HashMapNode<K, V>;
  // TODO
  //entrySet: Set<Map<K, V>>;

  // 存储的key-value键值对个数
  private size: number;
  // rehash的次数
  private modCount: number;
  // 初始容量 | rehash阈值
  private threshold = 16;
  // 负载因子
  private loadFactor = 0.75;

  constructor(initialCapacity: number | null, loadFactor: number | null) {
    if (initialCapacity !== null) {
      if (initialCapacity < 0) throw new IllegalArgumentException("Illegal initial capacity: ".concat(initialCapacity.toString()));
      if (initialCapacity > HashMap.MAXIMUM_CAPACITY) initialCapacity = HashMap.MAXIMUM_CAPACITY;
      this.threshold = HashMap.tableSizeFor(initialCapacity);
    }
    if (loadFactor !== null) {
      if (loadFactor <= 0 || isNaN(loadFactor)) throw new IllegalArgumentException("Illegal load factor: ".concat(initialCapacity.toString()));
      this.loadFactor = loadFactor;
    }
    this.size = 0;
    this.modCount = 0;
  };

  public getSize(): number {
    return this.size;
  }

  public isEmpty(): boolean {
    return this.size === 0;
  }

  getNode(hash: number, key: Object): HashMapNode<K, V> {
    let tab: HashMapNode<K, V>[];
    let first: HashMapNode<K, V>;
    let e: HashMapNode<K, V>;
    let n: number;
    let k: K;
    if ((tab = this.table) != null && (n = tab.length) > 0 &&
      (first = tab[(n - 1) & hash]) != null) {
      if (first.hash == hash && // always check first node
        ((k = first.key) == key || (key != null && key === k)))
        return first;
      if ((e = first.next) != null) {
        if (first instanceof TreeNode)
          return ((TreeNode<K,V>)first).getTreeNode(hash, key);
        do {
          if (e.hash == hash &&
            ((k = e.key) == key || (key != null && key === k)))
            return e;
        } while ((e = e.next) != null);
      }
    }
    return null;
  }

  public get(key: Object): V {
    let e: HashMapNode<K, V>;
    return (e = this.getNode(HashMap.hash(key), key)) === null ? null : e.value;
  }
}

class TreeNode<K, V> extends HashMapNode<K, V> {
  before: TreeNode<K, V>;
  after: TreeNode<K, V>;
  parent: TreeNode<K, V>;
  left: TreeNode<K, V>;
  right: TreeNode<K, V>;
  prev: TreeNode<K, V>;
  red: boolean;

  constructor(hash: number, key: K, value: V, next: HashMapNode<K, V>) {
    super(hash, key, value, next);
  }

  root(): TreeNode<K, V> {
    for (let r: TreeNode<K, V>, p: TreeNode<K, V>;;) {
      if ((p = r.parent) == null) return r;
      r = p;
    }
  }
}
