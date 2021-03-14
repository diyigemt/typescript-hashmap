class HashMapNode<K, V> {
  hash: number;
  key: K;
  value: V;
  next: HashMapNode<K, V> | null;

  constructor(hash: number, key: K, value: V, next: HashMapNode<K, V> | null) {
    this.hash = hash;
    this.key = key;
    this.value = value;
    this.next = next;
  }

  public getKey(): K {
    return this.key;
  }
  public getVale(): V {
    return this.value;
  }
  public toString(): string {
    return this.key + "=" + this.value;
  }
  // a simple implementation
  static hashCode(o: any | null): number {
    let str: string;
    if (o === null) {
      str = this.toString();
    } else {
      str = o.toString();
    }
    let h = 0,
      off = 0;
    const len = str.length;
    for (let i = 0; i < len; i++) {
      h = 31 * h + str.charCodeAt(off++);
    }
    const t = -2147483648 * 2;
    while (h > 2147483648) {
      h += t;
    }
    return h;
  }

  public setValue(newValue: V): V {
    const oldValue: V = this.value;
    this.value = newValue;
    return oldValue;
  }

  public equals(o: any): boolean {
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
    if (i <= 0) return i == 0 ? 32 : 0;
    let n = 31;
    if (i >= 1 << 16) {
      n -= 16;
      i >>>= 16;
    }
    if (i >= 1 << 8) {
      n -= 8;
      i >>>= 8;
    }
    if (i >= 1 << 4) {
      n -= 4;
      i >>>= 4;
    }
    if (i >= 1 << 2) {
      n -= 2;
      i >>>= 2;
    }
    return n - (i >>> 1);
  }

  static hash(key: any): number {
    let h: number;
    return key === null ? 0 : (h = HashMapNode.hashCode(key)) ^ (h >>> 16);
  }

  static tableSizeFor(cap: number): number {
    const n = -1 >>> HashMap.numberOfLeadingZeros(cap - 1);
    return n < 0
      ? 1
      : n >= HashMap.MAXIMUM_CAPACITY
        ? HashMap.MAXIMUM_CAPACITY
        : n + 1;
  }

  //内容
  table: (HashMapNode<K, V> | null)[] | null;
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

  constructor(
    initialCapacity: number | null,
    loadFactor: number | null,
    m: Map<K, V> | null
  ) {
    if (initialCapacity !== null) {
      if (initialCapacity < 0)
        throw new IllegalArgumentException(
          "Illegal initial capacity: ".concat(initialCapacity.toString())
        );
      if (initialCapacity > HashMap.MAXIMUM_CAPACITY)
        initialCapacity = HashMap.MAXIMUM_CAPACITY;
      this.threshold = HashMap.tableSizeFor(initialCapacity);
    }
    if (loadFactor !== null) {
      if (loadFactor <= 0 || isNaN(loadFactor))
        throw new IllegalArgumentException(
          "Illegal load factor: ".concat(loadFactor.toString())
        );
      this.loadFactor = loadFactor;
    }
    this.size = 0;
    this.modCount = 0;
    this.table = null;
    if (m !== null) {
      this.putMap(m, false);
    }
  }

  public getSize(): number {
    return this.size;
  }

  public isEmpty(): boolean {
    return this.size === 0;
  }

  public get(key: any): V | null {
    let e: HashMapNode<K, V> | null;
    return (e = this.getNode(HashMap.hash(key), key)) === null ? null : e.value;
  }

  getNode(hash: number, key: any): HashMapNode<K, V> | null {
    let tab: (HashMapNode<K, V> | null)[] | null;
    let first: HashMapNode<K, V> | null;
    let e: HashMapNode<K, V> | null;
    let n: number;
    let k: K;
    if (
      (tab = this.table) != null &&
      (n = tab.length) > 0 &&
      (first = tab[(n - 1) & hash]) != null
    ) {
      if (
        first.hash == hash && // always check first node
        ((k = first.key) == key || (key != null && key === k))
      )
        return first;
      if ((e = first.next) != null) {
        // TODO red-black tree
        // if (first instanceof TreeNode)
        //   return (first as TreeNode<K,V>).getTreeNode(hash, key);
        do {
          if (
            e.hash == hash &&
            ((k = e.key) == key || (key != null && key === k))
          )
            return e;
        } while ((e = e.next) != null);
      }
    }
    return null;
  }

  public containsKey(key: any): boolean {
    return this.getNode(HashMap.hash(key), key) !== null;
  }

  public put(key: K, value: V): V | null {
    return this.putVal(HashMap.hash(key), key, value, false, true);
  }

  public putMap(m: Map<K, V>, evict: boolean): void {
    const s = m.size;
    if (s > 0) {
      if (this.table == null) {
        // pre-size
        const ft = s / this.loadFactor + 1.0;
        const t = ft < HashMap.MAXIMUM_CAPACITY ? ft : HashMap.MAXIMUM_CAPACITY;
        if (t > this.threshold) this.threshold = HashMap.tableSizeFor(t);
      } else if (s > this.threshold) this.resize();
      for (const e of m) {
        const key = e[0];
        const value = e[1];
        this.putVal(HashMap.hash(key), key, value, false, evict);
      }
    }
  }

  putVal(
    hash: number,
    key: K,
    value: V,
    onlyIfAbsent: boolean,
    evict: boolean
  ): V | null {
    let tab: (HashMapNode<K, V> | null)[] | null;
    let p: HashMapNode<K, V> | null;
    let n: number, i: number;
    if ((tab = this.table) === null || (n = tab.length) === 0)
      n = (tab = this.resize()).length;
    if ((p = tab[(i = (n - 1) & hash)]) === null)
      tab[i] = this.newNode(hash, key, value, null);
    else {
      let e: HashMapNode<K, V> | null;
      let k: K;
      if (p.hash == hash && ((k = p.key) === key || (key != null && key === k)))
        e = p;
        // else if (p instanceof TreeNode)
      //   e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
      else {
        for (let binCount = 0; ; ++binCount) {
          if ((e = p.next) === null) {
            p.next = this.newNode(hash, key, value, null);
            // if (binCount >= HashMap.TREEIFY_THRESHOLD - 1) // -1 for 1st
            //   treeifyBin(tab, hash);
            break;
          }
          if (
            e.hash === hash &&
            ((k = e.key) === key || (key != null && key === k))
          )
            break;
          p = e;
        }
      }
      if (e != null) {
        // existing mapping for key
        const oldValue: V = e.value;
        if (!onlyIfAbsent || oldValue == null) e.value = value;
        this.afterNodeAccess(e);
        return oldValue;
      }
    }
    ++this.modCount;
    if (++this.size > this.threshold) this.resize();
    this.afterNodeInsertion(evict);
    return null;
  }

  resize(): (HashMapNode<K, V> | null)[] {
    const oldTab = this.table;
    const oldCap: number = oldTab === null ? 0 : oldTab.length;
    const oldThr: number = this.threshold;
    let newCap: number,
      newThr = 0;
    if (oldCap > 0) {
      if (oldCap >= HashMap.MAXIMUM_CAPACITY) {
        this.threshold = Number.MAX_VALUE;
        return oldTab as HashMapNode<K, V>[];
      } else if (
        (newCap = oldCap << 1) < HashMap.MAXIMUM_CAPACITY &&
        oldCap >= HashMap.DEFAULT_INITIAL_CAPACITY
      )
        newThr = oldThr << 1; // double threshold
    } else if (oldThr > 0)
      // initial capacity was placed in threshold
      newCap = oldThr;
    else {
      // zero initial threshold signifies using defaults
      newCap = HashMap.DEFAULT_INITIAL_CAPACITY;
      newThr = (HashMap.DEFAULT_LOAD_FACTOR *
        HashMap.DEFAULT_INITIAL_CAPACITY) as number;
    }
    if (newThr === 0) {
      const ft = newCap * this.loadFactor;
      const newThr =
        newCap < HashMap.MAXIMUM_CAPACITY && ft < HashMap.MAXIMUM_CAPACITY
          ? ft
          : Number.MAX_VALUE;
    }
    this.threshold = newThr;
    const newTab = new Array<HashMapNode<K, V> | null>(newCap);
    this.table = newTab;
    if (oldTab != null) {
      for (let j = 0; j < oldCap; ++j) {
        let e: HashMapNode<K, V> | null;
        if ((e = oldTab[j]) !== null) {
          oldTab[j] = null;
          if (e.next === null) newTab[e.hash & (newCap - 1)] = e;
            // else if (e instanceof TreeNode)
          //   ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
          else {
            // preserve order
            let loHead: HashMapNode<K, V> | null = null,
              loTail: HashMapNode<K, V> | null = null;
            let hiHead: HashMapNode<K, V> | null = null,
              hiTail: HashMapNode<K, V> | null = null;
            let next: HashMapNode<K, V> | null;
            do {
              next = e.next;
              if ((e.hash & oldCap) == 0) {
                if (loTail === null) loHead = e;
                else loTail.next = e;
                loTail = e;
              } else {
                if (hiTail === null) hiHead = e;
                else hiTail.next = e;
                hiTail = e;
              }
            } while ((e = next) !== null);
            if (loTail !== null) {
              loTail.next = null;
              newTab[j] = loHead;
            }
            if (hiTail != null) {
              hiTail.next = null;
              newTab[j + oldCap] = hiHead;
            }
          }
        }
      }
    }
    return newTab;
  }

  newNode(
    hash: number,
    key: K,
    value: V,
    next: HashMapNode<K, V> | null
  ): HashMapNode<K, V> {
    return new HashMapNode<K, V>(hash, key, value, next);
  }

  public putAll(m: Map<K, V>): void {
    this.putMap(m, true);
  }

  public remove(
    key: any,
    value: any | null
  ): V | null {
    let e: HashMapNode<K, V> | null;
    return (e = this.removeNode(HashMap.hash(key), key, value, false, true)) ==
    null
      ? null
      : e.value;
  }

  removeNode(
    hash: number,
    key: any,
    value: any | null,
    matchValue: boolean,
    movable: boolean
  ): HashMapNode<K, V> | null {
    let tab: (HashMapNode<K, V> | null)[] | null;
    let p: HashMapNode<K, V> | null;
    let n: number, index: number;
    if (
      (tab = this.table) !== null &&
      (n = tab.length) > 0 &&
      (p = tab[(index = (n - 1) & hash)]) !== null
    ) {
      let node: HashMapNode<K, V> | null = null,
        e: HashMapNode<K, V> | null;
      let k: K;
      let v: V;
      if (
        p.hash === hash &&
        ((k = p.key) === key || (key !== null && key === k))
      )
        node = p;
      else if ((e = p.next) !== null) {
        //   if (p instanceof TreeNode)
        //     node = ((TreeNode<K,V>)p).getTreeNode(hash, key);
        // else {
        do {
          if (
            e.hash == hash &&
            ((k = e.key) === key || (key !== null && key === k))
          ) {
            node = e;
            break;
          }
          p = e;
        } while ((e = e.next) !== null);
        // }
      }
      if (
        node !== null &&
        (!matchValue ||
          (v = node.value) === value ||
          (value !== null && value === v))
      ) {
        //   if (node instanceof TreeNode)
        //     ((TreeNode<K,V>)node).removeTreeNode(this, tab, movable);
        // else if (node == p)
        if (node == p) tab[index] = node.next;
        else p.next = node.next;
        ++this.modCount;
        --this.size;
        this.afterNodeRemoval(node);
        return node;
      }
    }
    return null;
  }

  public clear(): void {
    let tab: (HashMapNode<K, V> | null)[] | null;
    this.modCount++;
    if ((tab = this.table) !== null && this.size > 0) {
      this.size = 0;
      for (let i = 0; i < tab.length; ++i) tab[i] = null;
    }
  }

  public containsValue(value: any): boolean {
    let tab: (HashMapNode<K, V> | null)[] | null;
    let v: V;
    if ((tab = this.table) !== null && this.size > 0) {
      for (let e of tab) {
        for (; e !== null; e = e.next) {
          if ((v = e.value) === value || (value !== null && value === v))
            return true;
        }
      }
    }
    return false;
  }

  public getOrDefault(key: any, defaultValue: V): V {
    let e: HashMapNode<K, V> | null;
    return (e = this.getNode(HashMap.hash(key), key)) === null
      ? defaultValue
      : e.value;
  }

  public putIfAbsent(key: K, value: V): V | null {
    return this.putVal(HashMap.hash(key), key, value, true, true);
  }

  public values(): (V | null)[] {
    const values: (V | null)[] = [];
    if (this.table === null) return values;
    for (const item of this.table) {
      values.push(item === null ? null : item.value);
    }
    return values;
  }

  public keys(): (K | null)[] {
    const keys: (K | null)[] = [];
    if (this.table === null) return keys;
    for (const item of this.table) {
      keys.push(item === null ? null : item.key);
    }
    return keys;
  }

  public entries(): ([K, V] | null)[] {
    const entries: ([K, V] | null)[] = [];
    if (this.table === null) return entries;
    for (const item of this.table) {
      entries.push(item === null ? null : [item.key, item.value]);
    }
    return entries;
  }

  public forEach(func: Function) {
    if (this.table === null) return;
    for (const item of this.table) {
      func.call(item);
    }
  }

  public clone(): HashMap<K, V> {
    const res = new HashMap<K, V>(null, null, null);
    res.putMap(this.map(), false);
    return res;
  }

  public map(): Map<K, V> {
    const map = new Map<K, V>();
    if (this.table === null) return map;
    for (const item of this.table) {
      map.set(item!.key, item!.value);
    }
    return map;
  }

  public replace(key: K, ...values: V[]): V | null {
    const e = this.getNode(HashMap.hash(key), key);
    let v: V;
    if (values.length === 1) {
      if (e !== null) {
        const oldValue = e.value;
        e.value = values[0];
        this.afterNodeAccess(e);
        return oldValue;
      }
    } else if (values.length === 2) {
      const oldValue = values[1];
      if (
        e !== null &&
        ((v = e.value) === oldValue || (v !== null && v === oldValue))
      ) {
        e.value = values[0];
        this.afterNodeAccess(e);
        return oldValue;
      }
    }
    return null;
  }

  // Callbacks to allow LinkedHashMap post-actions
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  afterNodeAccess(p: HashMapNode<K, V>): void {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  afterNodeInsertion(evict: boolean): void {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  afterNodeRemoval(p: HashMapNode<K, V>): void {}
}

// TODO red-black tree
class TreeNode<K, V> extends HashMapNode<K, V> {
  before: TreeNode<K, V> | null;
  after: TreeNode<K, V> | null;
  parent: TreeNode<K, V> | null;
  left: TreeNode<K, V> | null;
  right: TreeNode<K, V> | null;
  prev: TreeNode<K, V> | null;
  red: boolean;

  constructor(hash: number, key: K, value: V, next: HashMapNode<K, V>) {
    super(hash, key, value, next);
    this.before = null;
    this.after = null;
    this.parent = null;
    this.left = null;
    this.right = null;
    this.prev = null;
    this.red = false;
  }

  root(r: TreeNode<K, V>): TreeNode<K, V> | null {
    for (let p: TreeNode<K, V> | null; ; ) {
      if ((p = r.parent) == null) return r;
      r = p;
    }
  }

  /**
   * Ensures that the given root is the first node of its bin.
   */
  static moveRootToFront<K, V>(
    tab: HashMapNode<K, V>[],
    root: TreeNode<K, V>
  ): void {
    let n: number;
    if (root !== null && tab !== null && (n = tab.length) > 0) {
      const index: number = (n - 1) & root.hash;
      const first: TreeNode<K, V> = tab[index] as TreeNode<K, V>;
      if (root !== first) {
        let rn: HashMapNode<K, V> | null;
        tab[index] = root;
        const rp = root.prev;
        if ((rn = root.next) !== null) (rn as TreeNode<K, V>).prev = rp;
        if (rp !== null) rp.next = rn;
        if (first !== null) first.prev = root;
        root.next = first;
        root.prev = null;
      }
      if (!TreeNode.checkInvariants(root))
        throw new Error("given root is not the first node of its bin");
    }
  }

  /**
   * Recursive invariant check
   */
  static checkInvariants<K, V>(t: TreeNode<K, V>): boolean {
    const tp = t.parent,
      tl = t.left,
      tr = t.right,
      tb = t.prev,
      tn = t.next as TreeNode<K, V>;
    if (tb !== null && tb.next !== t) return false;
    if (tn !== null && tn.prev !== t) return false;
    if (tp !== null && t !== tp.left && t !== tp.right) return false;
    if (tl !== null && (tl.parent !== t || tl.hash > t.hash)) return false;
    if (tr !== null && (tr.parent !== t || tr.hash < t.hash)) return false;
    if (t.red && tl !== null && tl.red && tr !== null && tr.red) return false;
    if (tl !== null && !TreeNode.checkInvariants(tl)) return false;
    return !(tr !== null && !TreeNode.checkInvariants(tr));
  }
}
