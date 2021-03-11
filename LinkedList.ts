class LinkedLiskNode<E> {

	item: E;
	next: LinkedLiskNode<E>;
	prev: LinkedLiskNode<E>;

	constructor(prev: LinkedLiskNode<E>, element: E, next: LinkedLiskNode<E>) {
		this.item = element;
		this.next = next;
		this.prev = prev;
	}
}

export default class LinkedList<E> {
	modCount: number; // 最后一次结构改变的次数
	size: number;
	first: LinkedLiskNode<E>;
	last: LinkedLiskNode<E>;

	constructor() {
		this.modCount = 0;
		this.size = 0;
	}

	// 插入头部
	private linkFirst(e: E): void {
		const f: LinkedLiskNode<E> = this.first;
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
	private linkLast(e: E): void {
		const l: LinkedLiskNode<E> = this.last;
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
		const pred: LinkedLiskNode<E> = succ.prev;
		const newNode: LinkedLiskNode<E> = new LinkedLiskNode<E>(pred, e, succ);
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
	private unlinkFirst(f: LinkedLiskNode<E>): E {
		const element: E = f.item;
		const next: LinkedLiskNode<E> = f.next;
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
	private unlinkLast(l: LinkedLiskNode<E>): E {
		const element: E = l.item;
		const prev: LinkedLiskNode<E> = l.prev;
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
	unlink(x: LinkedLiskNode<E>): E {
		const element: E = x.item;
		const next: LinkedLiskNode<E> = x.next;
		const prev: LinkedLiskNode<E> = x.prev;

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
		Map<>()
		return element;
	}

	//获取头节点
	public getFirst(): E {
		const f: LinkedLiskNode<E> = this.first;
		if (f === null) throw new ReferenceError("first node is null !");
		return f.item;
	}
}