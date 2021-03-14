# Typescript-HashMap

## What's this 这是啥
```
a typescript hashmap
translation from java
```

### How to use 怎么用
download or clone this repository </br>
copy HashMap.ts to your project folder
```typescript
import HashMap from "xxxx/HashMap.ts";
const map = new HashMap<K, V>(null, null, null);
map.put(key, value);
map.get(key);
```
### Constructor 构造函数
```typescript
/**
 * Constructs an empty {@code HashMap} (if m is null) with the specified initial
 * capacity and load factor.
 *
 * @param  initialCapacity the initial capacity
 * @param  loadFactor      the load factor
 * @param  m               data
 * @throws IllegalArgumentException if the initial capacity is negative
 *         or the load factor is nonpositive
 */
new HashMap<K, V>(initialCapacity: number | null,
  loadFactor: number | null,
  m: Map<K, V> | null);
```

### Methods 方法
```

```
