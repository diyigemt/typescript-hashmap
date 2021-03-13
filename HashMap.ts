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
  table: HashMapNode<K, V>[];
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

  public get(key: Object): V {
    let e: HashMapNode<K, V>;
    return (e = this.getNode(HashMap.hash(key), key)) === null ? null : e.value;
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
        // TODO red-black tree
        // if (first instanceof TreeNode)
        //   return (first as TreeNode<K,V>).getTreeNode(hash, key);
        do {
          if (e.hash == hash &&
            ((k = e.key) == key || (key != null && key === k)))
            return e;
        } while ((e = e.next) != null);
      }
    }
    return null;
  }

  public containsKey(key: Object): boolean {
    return this.getNode(HashMap.hash(key), key) !== null;
  }

  public put(key: K, value: V): V {
    return this.putVal(HashMap.hash(key), key, value, false, true);
  }

  putVal(hash: number, key: K, value: V, onlyIfAbsent: boolean, evict: boolean): V {
    let tab: HashMapNode<K,V>[]; let p: HashMapNode<K,V>;
    let n: number, i: number;
    if ((tab = this.table) == null || (n = tab.length) == 0)
      n = (tab = this.resize()).length;
    if ((p = tab[i = (n - 1) & hash]) == null)
      tab[i] = this.newNode(hash, key, value, null);
    else {
      let e: HashMapNode<K,V>;
      let k: K;
      if (p.hash == hash &&
        ((k = p.key) == key || (key != null && key === k )))
        e = p;
      // else if (p instanceof TreeNode)
      //   e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
    else {
        for (let binCount: number = 0; ; ++binCount) {
          if ((e = p.next) == null) {
            p.next = this.newNode(hash, key, value, null);
            // if (binCount >= HashMap.TREEIFY_THRESHOLD - 1) // -1 for 1st
            //   treeifyBin(tab, hash);
            break;
          }
          if (e.hash == hash &&
            ((k = e.key) == key || (key != null && key === k)))
            break;
          p = e;
        }
      }
      if (e != null) { // existing mapping for key
        const oldValue: V = e.value;
        if (!onlyIfAbsent || oldValue == null)
          e.value = value;
        this.afterNodeAccess(e);
        return oldValue;
      }
    }
    ++this.modCount;
    if (++this.size > this.threshold)
      this.resize();
    this.afterNodeInsertion(evict);
    return null;
  }

  resize(): HashMapNode<K, V>[] {
    const oldTab: HashMapNode<K, V>[] = this.table;
    let oldCap: number = (oldTab == null) ? 0 : oldTab.length;
    let oldThr: number = this.threshold;
    let newCap: number, newThr: number = 0;
    if (oldCap > 0) {
      if (oldCap >= HashMap.MAXIMUM_CAPACITY) {
        this.threshold = Number.MAX_VALUE;
        return oldTab;
      }
      else if ((newCap = oldCap << 1) < HashMap.MAXIMUM_CAPACITY &&
        oldCap >= HashMap.DEFAULT_INITIAL_CAPACITY)
        newThr = oldThr << 1; // double threshold
    }
    else if (oldThr > 0) // initial capacity was placed in threshold
      newCap = oldThr;
    else {               // zero initial threshold signifies using defaults
      newCap = HashMap.DEFAULT_INITIAL_CAPACITY;
      newThr = (HashMap.DEFAULT_LOAD_FACTOR * HashMap.DEFAULT_INITIAL_CAPACITY) as number;
    }
    if (newThr == 0) {
      let ft: number = newCap * this.loadFactor as number;
      let newThr: number = (newCap < HashMap.MAXIMUM_CAPACITY && ft < HashMap.MAXIMUM_CAPACITY ?
        ft : Number.MAX_VALUE);
    }
    this.threshold = newThr;
    const newTab: HashMapNode<K, V>[] = new HashMapNode[newCap];
    this.table = newTab;
    if (oldTab != null) {
      for (let j: number = 0; j < oldCap; ++j) {
        let e: HashMapNode<K, V>;
        if ((e = oldTab[j]) != null) {
          oldTab[j] = null;
          if (e.next == null)
            newTab[e.hash & (newCap - 1)] = e;
          // else if (e instanceof TreeNode)
          //   ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
        else { // preserve order
            let loHead: HashMapNode<K, V> = null, loTail: HashMapNode<K, V> = null;
            let hiHead: HashMapNode<K, V> = null, hiTail: HashMapNode<K, V> = null;
            let next: HashMapNode<K, V>;
            do {
              next = e.next;
              if ((e.hash & oldCap) == 0) {
                if (loTail == null)
                  loHead = e;
                else
                  loTail.next = e;
                loTail = e;
              }
              else {
                if (hiTail == null)
                  hiHead = e;
                else
                  hiTail.next = e;
                hiTail = e;
              }
            } while ((e = next) != null);
            if (loTail != null) {
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

  newNode(hash: number, key: K, value: V, next: HashMapNode<K, V>): HashMapNode<K, V> {
    return new HashMapNode<K, V>(hash, key, value, next);
  }

  // Callbacks to allow LinkedHashMap post-actions
  afterNodeAccess(p: HashMapNode<K, V>): void { }
  afterNodeInsertion(evict: boolean): void { }
  afterNodeRemoval(p: HashMapNode<K, V>): void { }
}

// TODO red-black tree
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

  /**
   * Ensures that the given root is the first node of its bin.
   */
  static moveRootToFront<K, V>(tab: HashMapNode<K, V>[], root: TreeNode<K, V>): void {
    let n: number;
    if (root != null && tab != null && (n = tab.length) > 0) {
      const index: number = (n - 1) & root.hash;
      const first: TreeNode<K,V> = tab[index] as TreeNode<K,V>;
      if (root != first) {
        let rn: HashMapNode<K, V>;
        tab[index] = root;
        const rp: TreeNode<K,V> = root.prev;
        if ((rn = root.next) != null)
          (rn as TreeNode<K,V>).prev = rp;
        if (rp != null)
          rp.next = rn;
        if (first != null)
          first.prev = root;
        root.next = first;
        root.prev = null;
      }
      if (!TreeNode.checkInvariants(root)) throw new Error("given root is not the first node of its bin");
    }
  }

  /**
   * Recursive invariant check
   */
  static checkInvariants<K, V>(t: TreeNode<K, V>): boolean {
    const tp: TreeNode<K,V> = t.parent, tl: TreeNode<K,V> = t.left, tr: TreeNode<K,V> = t.right,
      tb = t.prev, tn = t.next as TreeNode<K,V>;
    if (tb != null && tb.next != t)
      return false;
    if (tn != null && tn.prev != t)
      return false;
    if (tp != null && t != tp.left && t != tp.right)
      return false;
    if (tl != null && (tl.parent != t || tl.hash > t.hash))
      return false;
    if (tr != null && (tr.parent != t || tr.hash < t.hash))
      return false;
    if (t.red && tl != null && tl.red && tr != null && tr.red)
      return false;
    if (tl != null && !TreeNode.checkInvariants(tl))
      return false;
    return !(tr != null && !TreeNode.checkInvariants(tr));
  }
}
