export class Deferred<T> {
  public resolve!: (value: T) => void;
  public reject!: (err?: unknown) => void;
  public promise!: Promise<T>;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
