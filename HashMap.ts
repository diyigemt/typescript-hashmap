export default class HashMap<K, V> {
  // 存储的key-value键值对个数
  private size: number;
  // rehash的次数
  private modCount: number;
  // 初始容量 | rehash阈值
  private threshold = 16;
  // 负载因子
  private loadFactor = 0.75;

  constructor() {
    this.size = 0;
    this.modCount = 0;
  };
}