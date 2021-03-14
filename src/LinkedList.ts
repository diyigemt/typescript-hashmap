class LinkedLiskNode<E> {

	item: E | null;
	next: LinkedLiskNode<E>| null;
	prev: LinkedLiskNode<E>| null;

	constructor(prev: LinkedLiskNode<E> | null, element: E, next: LinkedLiskNode<E> | null) {
		this.item = element;
		this.next = next;
		this.prev = prev;
	}
}

export default class LinkedList<E> {
	modCount: number; // 最后一次结构改变的次数
	size: number;
	first: LinkedLiskNode<E> | null;
	last: LinkedLiskNode<E> | null;

	constructor() {
		this.modCount = 0;
		this.size = 0;
		this.first = null;
		this.last = null;
	}

	getModCount(): number {
		return this.modCount;
	}

	// 插入头部
	private linkFirst(e: E): void {
		const f = this.first;
		const newNode: LinkedLiskNode<E> = new LinkedLiskNode<E>(null, e, f);
		this.first = newNode;
		if (f == null) {
			this.last = newNode;
		}	else {
			f.prev = newNode;
		}
		this.size++;
		this.modCount++;
	}

	//插入尾部
	public linkLast(e: E): void {
		const l = this.last;
		const newNode: LinkedLiskNode<E> = new LinkedLiskNode<E>(l, e, null);
		this.last = newNode;
		if (l == null) {
			this.first = newNode;
		} else {
			l.next = newNode;
		}
		this.size++;
		this.modCount++;
	}

	//插入某个节点之前
	linkBefore(e: E, succ: LinkedLiskNode<E>): void {
		const pred = succ.prev;
		const newNode = new LinkedLiskNode<E>(pred, e, succ);
		succ.prev = newNode;
		if (pred === null) {
			this.first = newNode;
		} else {
			pred.next = newNode;
		}
		this.size++;
		this.modCount++;
	}

	//移除非空头节点
	private unlinkFirst(f: LinkedLiskNode<E>): E | null {
		const element = f.item;
		const next = f.next;
		f.item = null;
		f.next = null;
		this.first = next;
		if (next === null) {
			this.last = null;
		} else {
			next.prev = null;
		}
		this.size--;
		this.modCount++;
		return element;
	}

	//移除非空尾节点
	private unlinkLast(l: LinkedLiskNode<E>): E | null {
		const element = l.item;
		const prev = l.prev;
		l.item = null;
		l.prev = null;
		this.last = prev;
		if (prev === null) {
			this.first = null;
		} else {
			prev.next = null;
		}
		this.size--;
		this.modCount++;
		return element;
	}

	//移除非空节点
	unlink(x: LinkedLiskNode<E>): E | null {
		const element = x.item;
		const next = x.next;
		const prev = x.prev;

		if (prev === null) {
			this.first = next;
		} else {
			prev.next = next;
			x.prev = null;
		}

		if (next == null) {
			this.last = prev;
		} else {
			next.prev = prev;
			x.next = null;
		}
		x.item = null;
		this.size--;
		this.modCount++;
		return element;
	}

	//获取头节点
	public getFirst(): E | null {
		const f = this.first;
		if (f === null) throw new ReferenceError("first node is null !");
		return f.item;
	}

	//获取尾节点
	public getLast(): E | null {
		const l = this.last;
		if (l === null) throw new ReferenceError("last node is null !");
		return l.item;
	}

	//删除头节点
	public removeFirst(): E | null {
		const f = this.first;
		if (f === null) throw new ReferenceError("first node is null !");
		return this.unlinkFirst(f);
	}

	//删除尾节点
	public removeLast(): E | null {
		const l = this.last;
		if (l === null) throw new ReferenceError("last node is null !");
		return this.unlinkLast(l);
	}

	//插入头
	public addFirst(e: E): void {
		this.linkFirst(e);
	}

	//插入尾
	public addLast(e: E): void {
		this.linkLast(e);
	}

	//是否包含
	public contains(o: Object): boolean {
		return this.indexOf(o) >= 0;
	}

	//获取大小
	public getSize(): number {
		return this.size;
	}

	//添加节点(默认插入末尾)
	public add(e: E, index: number | null): boolean {
		if (index === null) {
			this.linkLast(e);
		} else {
			this.checkPositionIndex(index);
			if (index == this.size){
				this.linkLast(e);
			} else {
				this.linkBefore(e, this.node(index));
			}
		}
		return true;
	}

	//移除节点
	public remove(o: Object | null, index: number | null): E | null {
		if (o === null && index === null) return this.removeFirst();
		if (o === null && index !== null) {
			this.checkElementIndex(index);
			return this.unlink(this.node(index));
		}
		if (o === null) {
			for (let x = this.first; x !== null; x = x.next) {
				if (x.item === null) {
					return this.unlink(x);
				}
			}
		} else {
			for (let x = this.first; x !== null; x = x.next) {
				if (o === x.item) {
					return this.unlink(x);
				}
			}
		}
		return null;
	}

	//添加所有节点
	public addAll(index: number, c: Array<E>): boolean {
		this.checkPositionIndex(index);

		const a: Object[] = [...c];
		const numNew: number = a.length;
		if (numNew === 0) return false;

		let pred: LinkedLiskNode<E> | null, succ: LinkedLiskNode<E> | null;
		if (index === this.size) {
			succ = null;
			pred = this.last;
		} else {
			succ = this.node(index);
			pred = succ.prev;
		}

		for (const o of a) {
			const e: E = o as E;
			const newNode: LinkedLiskNode<E> = new LinkedLiskNode<E>(pred, e, null);
			if (pred === null) {
				this.first = newNode
			} else {
				pred.next = newNode;
			}
		}
		return true;
	}

	//清除所有节点
	public clear(): void {
		for (let x: LinkedLiskNode<E> | null = null; x !== null;) {
			const next: LinkedLiskNode<E> = x.next as LinkedLiskNode<E>;
			x.item = null;
      x.next = null;
      x.prev = null;
      x = next;
		}
		this.first = this.last = null;
		this.size = 0;
		this.modCount++;
	}

	//获取一个节点
	public get(index: number): E {
		this.checkElementIndex(index);
		return this.node(index).item as E;
	}

	//替换一个节点
	public set(index: number, element: E): E {
		this.checkElementIndex(index);
		const x: LinkedLiskNode<E> = this.node(index);
		const oldVal: E = x.item as E;
		x.item = element;
		return oldVal;
	}

	//检查元素index合法性
	private isElementIndex(index: number): boolean {
		return index >=0 && index < this.size;
	}

	//检查节点位置合法性
	private isPositionIndex(index: number): boolean {
		return index >= 0 && index <= this.size;
	}

	//获取越界信息
	private outOfBoundsMsg(index: number): string {
		return "Index: ".concat(index.toString(), ", Size:", this.size.toString());
	}

	//检查元素index合法性 并抛出异常
	private checkElementIndex(index: number): void {
		if (!this.isElementIndex(index)) throw new RangeError(this.outOfBoundsMsg(index));
	}

	//检查节点位置合法性 并抛出异常
	private checkPositionIndex(index: number): void {
		if (!this.isPositionIndex(index)) throw new RangeError(this.outOfBoundsMsg(index));
	}

	//根据节点index获取内容
	node(index: number): LinkedLiskNode<E> {
		if (index < (this.size >> 1)) {
			let x: LinkedLiskNode<E> = this.first as LinkedLiskNode<E>;
			for (let i = 0; i < index; i++)
					x = x.next as LinkedLiskNode<E>;
			return x;
		} else {
			let x: LinkedLiskNode<E> = this.last as LinkedLiskNode<E>;
				for (let i = this.size - 1; i > index; i--)
						x = x.prev as LinkedLiskNode<E>;
				return x;
		}
	}


	//获取一个节点的位置
	public indexOf(o: Object): number {
		let index: number = 0;
		if (o === null) {
			for (let x: LinkedLiskNode<E> = this.first as LinkedLiskNode<E>; x !== null; x = x.next as LinkedLiskNode<E>) {
				if (x.item === null) {
					return index;
				}
				index++;
			}
		} else {
			for (let x: LinkedLiskNode<E> = this.first as LinkedLiskNode<E>; x !== null; x = x.next as LinkedLiskNode<E>) {
				if (o === x.item) {
					return index;
				}
				index++;
			}
		}
		return -1;
	}

	//元素出现的最后一个index
	public lastIndexOf(o: Object): number {
		let index: number = this.size;
		if (o == null) {
			for (let x: LinkedLiskNode<E> = this.last as LinkedLiskNode<E>; x !== null; x = x.prev as LinkedLiskNode<E>) {
				index--;
				if (x.item == null) {
					return index;
				}
			}
		} else {
			for (let x: LinkedLiskNode<E> = this.first as LinkedLiskNode<E>; x !== null; x = x.prev as LinkedLiskNode<E>) {
				index--;
				if (o === x.item) {
					return index;
				}
			}
		}
		return -1;
	}

	//获取头节点内容
	public peek(): E | null {
		const f = this.first;
		return (f === null) ? null : f.item;
	}

	//获取头节点内容 抛出异常
	public element(): E | null {
		return this.getFirst();
	}

	//获取头节点 并移除头节点
	public poll(): E | null {
		const f = this.first;
		return (f === null) ? null : this.unlinkFirst(f);
	}

	//将元素插入尾部
	public offer(e: E): boolean {
		return this.add(e, null);
	}

	//将元素插入头部
	public offerFirst(e: E): boolean {
		this.addFirst(e);
		return true;
	}

	//将元素插入尾部
	public offerLast(e: E): boolean {
		this.addLast(e);
		return true;
	}

	//获取头节点内容
	public peekFirst(): E | null {
		const f = this.first;
		return (f === null) ? null : f.item;
	}

	//获取尾节点内容
	public peekLast(): E | null {
		const l = this.last;
		return (l === null) ? null : l.item;
	}

	//获取头节点 并移除头节点
	public pollFirst(): E | null {
		const f = this.first;
		return (f === null) ? null : this.unlinkFirst(f);
	}

	//获取尾节点 并移除尾节点
	public pollLast(): E | null {
		const l = this.last;
		return (l === null) ? null : this.unlinkLast(l);
	}

	//插入头节点
	public push(e: E): void {
		this.addFirst(e);
	}

	//弹出头节点
	public pop(): E | null {
		return this.removeFirst();
	}

	//从头开始 移除最先出现的目标对象
	public removeFirstOccurrence(o: Object): E | null {
		return this.remove(o, null);
	}

	//从尾开始 移除最先出现的目标对象
	public removeLastOccurrence(o: Object): E | null {
		if (o == null) {
			for (let x = this.last; x !== null; x = x.prev) {
				if (x.item == null) {
					return this.unlink(x);
				}
			}
		} else {
			for (let x = this.last; x !== null; x = x.prev) {
				if (o === x.item) {
					return this.unlink(x);
				}
			}
		}
		return null;
	}

	//克隆
	public clone(): Object {
		const clone = new LinkedList<E>();

		clone.first = clone.last = null;
		clone.size = 0;
		clone.modCount = 0;

		for(let x = this.first; x !== null; x = x.next) {
			clone.add(x.item as E, null);
		}
		return clone;
	}

	public listIterator(index: number): ListItr<E> {
		this.checkPositionIndex(index);
		return new ListItr<E>(index, this);
	}
}

class ListItr<E> {
	private list: LinkedList<E>;

	private lastReturned: LinkedLiskNode<E> | null;
	private nextItem: LinkedLiskNode<E> | null;
	private nextIndex: number;
	private expectedModCount;

	constructor(index: number, list: LinkedList<E>) {
		this.expectedModCount = 0;
		this.lastReturned = null;
		this.nextIndex = index;
		this.list = list;
		this.nextItem = (index === this.list.getSize()) ? null : this.list.node(index);
	}

	public hasNext(): boolean {
		return this.nextIndex < this.list.getSize();
	}

	public next(): E {
		this.checkForComodification();
		if (!this.hasNext()) throw new RangeError("no next element");

		this.lastReturned = this.nextItem;
		this.nextItem = (this.nextItem as LinkedLiskNode<E>).next;
		this.nextIndex++;
		return (this.lastReturned as LinkedLiskNode<E>).item as E;
	}

	public hasPrevious(): boolean {
		return this.nextIndex > 0;
	}

	public previous(): E | null {
		this.checkForComodification();
		if(!this.hasPrevious()) throw new RangeError("no previous element");

		this.lastReturned = this.nextItem = (this.nextIndex === null) ? this.list.last : (this.nextItem as LinkedLiskNode<E>).prev;
		this.nextIndex--;
		return (this.lastReturned as LinkedLiskNode<E>).item;
	}

	public getLastIndex(): number {
		return this.nextIndex;
	}

	public getPreviousIndex(): number {
		return this.nextIndex - 1;
	}

	public remove(): void {
		this.checkForComodification();
		if (this.lastReturned === null) {
			throw new Error("IllegalStateException, cannot remove, last return is null");
		}

		const lastNext = this.lastReturned.next;
		this.list.unlink(this.lastReturned);
		if (this.nextItem === this.lastReturned) {
			this.nextItem = lastNext;
		} else {
			this.nextIndex--;
		}
		this.lastReturned = null;
		this.expectedModCount++;
	}

	public set(e: E): void {
		if (this.lastReturned === null) {
			throw new Error("IllegalStateException, cannot remove, last return is null");
		}
		this.checkForComodification();
		this.lastReturned.item = e;
	}

	public add(e: E): void {
		this.checkForComodification();
		this.lastReturned = null;
		if (this.nextItem === null) {
			this.list.linkLast(e);
		} else {
			this.list.linkBefore(e, this.nextItem);
		}
		this.nextIndex++;
		this.expectedModCount++;
	}

	private checkForComodification(): void {

	}
}
