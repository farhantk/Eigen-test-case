import { BadRequestException } from '@nestjs/common';
import { Book } from 'src/domain/entities/book.entity';
import { Borrow } from './borrow.entity';

export class Member {
    private borrowLimit = 2;

    constructor(
        public readonly code: string,
        public name: string,
        private penaltyUntil: Date | null,
        private borrowedBooks: Borrow[] = []
    ) {}

    canBorrow(n_borrowed: number): boolean {
        if (this.penaltyUntil && this.penaltyUntil > new Date()) {
            throw new BadRequestException('Member is penalized')
            //return false; 
        }

        console.log(">>>", n_borrowed)
        return n_borrowed < this.borrowLimit;
    }

    borrowBook(book: Book, n_borrowed: number) {
        if (!this.canBorrow(n_borrowed)) throw new BadRequestException("Cannot borrow more books");
        book.borrow(); 
    }

    getPenaltyUntil(): Date | null{
        return this.penaltyUntil;
    }

    returnBook(book: Book, borrowedDate: Date, returnDate: Date) {
        const daysBorrowed = (returnDate.getTime() - borrowedDate.getTime()) / (1000 * 3600 * 24);

        if (daysBorrowed > 7) {
            this.penaltyUntil = new Date(returnDate.getTime() + 3 * 24 * 3600 * 1000);
        }
        book.return();
    }
}
