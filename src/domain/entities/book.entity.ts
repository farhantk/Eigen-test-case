export class Book {
  constructor(
    public readonly code: string,
    public title: string,
    public author: string,
    private stock: number
  ) {}

  isAvailable(): boolean {
    return this.stock > 0;
  }

  borrow() {
    if (!this.isAvailable()) throw new Error("Book not available");
    this.stock--;
  }

  return() {
    this.stock++;
  }

  getDetails() {
    return {
      code: this.code,
      title: this.title,
      author: this.author,
      stock: this.stock,
    };
  }
}