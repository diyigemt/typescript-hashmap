class LinkedLiskNode<E> {

	item: E;
	next: LinkedLiskNode<E>;
	prev: LinkedLiskNode<E>;

	constructor(prev: LinkedLiskNode<E>, element: E, next: LinkedLiskNode) {
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

	private linkFirst(e: E) {
		const f: LinkedLiskNode<E> = this.first;
		const newNode: LinkedLiskNode<E> = new LinkedLiskNode<E>(null, e, f);
		this.last = newNode;
		this.first = newNode;
		if (f == null)
			this.last = newNode;
		else
				f.prev = newNode;
		this.size++;
		this.modCount++;
	}
}