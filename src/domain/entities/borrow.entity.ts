export class Borrow {
    constructor(
        public readonly id: number,
        public membercode: string,
        public bookcode: string,
        public borrowDate: Date,
        public returnDate: Date | null,
    ){}
    
    getDetails(){
        return {
            id: this.id,
            membercode: this.membercode,
            bookcode: this.bookcode,
            borrowDate: this.borrowDate,
            returnDate: this.returnDate
        }
    }
    late(): boolean{
        const today = new Date();
        const borrowLimit = new Date(this.borrowDate);
        borrowLimit.setDate(borrowLimit.getDate() + 7);

        if (!this.returnDate) {
        return today > borrowLimit;
        }

        return this.returnDate > borrowLimit;

    }
}