import list from "./LinkedList";

interface LinkedLiskConstructor {
  new<E>(): list<E>
}

declare var LinkedList: LinkedLiskConstructor