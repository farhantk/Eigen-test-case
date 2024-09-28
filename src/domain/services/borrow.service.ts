import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { BorrowResponse, CreateBorrowDTO, UpdateBorrowDTO } from "../../application/dto/borrow.dto";
import { PrismaService } from "../../insfrastructure/database/prisma.service";
import { Book } from "../entities/book.entity";
import { Borrow } from "../entities/borrow.entity";
import { Member } from "../entities/member.entity";


@Injectable()
export class BorrowService{
    constructor(
        private prisma: PrismaService
    ){}
    
    async getAllBorrows(): Promise<BorrowResponse[]> {
        return this.prisma.borrow.findMany({
            include: {
                member: true,
                book: true
            },
        });
    }

    async createBorrow(createBorrowDto: CreateBorrowDTO): Promise<BorrowResponse> {
        const memberRecord = await this.prisma.member.findUnique({
            where: { code: createBorrowDto.memberCode },
            include: { borrowedBooks: 
                {where: {
                    returnDate: null,
            }} },
        });
    
        if (!memberRecord) {
            throw new NotFoundException(`Member with code ${createBorrowDto.memberCode} not found`);
        }
        
        const member = new Member(
            memberRecord.code,
            memberRecord.name,
            memberRecord.penaltyUntil
        );
    
        const bookRecord = await this.prisma.book.findUnique({
            where: { code: createBorrowDto.bookCode },
        });
    
        if (!bookRecord) {
            throw new NotFoundException(`Book with code ${createBorrowDto.bookCode} not found`);
        }
    
        const book = new Book(bookRecord.code, bookRecord.title, bookRecord.author, bookRecord.stock);
        if (!book.isAvailable()) {
            throw new BadRequestException('Book is not available for borrowing');
        }
        member.borrowBook(book, memberRecord.borrowedBooks.length);
    
        const borrowRecord = await this.prisma.borrow.create({
            data: {
                memberCode: createBorrowDto.memberCode,
                bookCode: createBorrowDto.bookCode,
                borrowDate: new Date(),
            },
        });
    
        await this.prisma.book.update({
            where: { code: createBorrowDto.bookCode },
            data: { stock: bookRecord.stock - 1 },
        });
    
        return {
            id: borrowRecord.id,
            memberCode: borrowRecord.memberCode,
            bookCode: borrowRecord.bookCode,
            borrowDate: borrowRecord.borrowDate
        };
    }

    async returnBook(id: number): Promise<BorrowResponse> {
        const borrowRecord = await this.prisma.borrow.findUnique({
            where: {
                id: id,
            },
            include: {
                member: true,
                book: true,
            },
        });
    
        if (!borrowRecord) {
            throw new NotFoundException(`Borrow record with ID ${id} not found`);
        }
        const nowDate = new Date()
    
        const book = new Book(borrowRecord.book.code, borrowRecord.book.title, borrowRecord.book.author, borrowRecord.book.stock);
        const member = new Member(borrowRecord.member.code, borrowRecord.member.name, borrowRecord.member.penaltyUntil);

        member.returnBook(book, borrowRecord.borrowDate, nowDate);

        const borrow = new Borrow(id, borrowRecord.memberCode, borrowRecord.bookCode, borrowRecord.borrowDate, nowDate);

        if (borrow.late()) {
            await this.prisma.member.update({
                where: { code: borrowRecord.memberCode },
                data: { penaltyUntil: member.getPenaltyUntil() },
            });
        }
        
        await this.prisma.book.update({
            where: { code: borrowRecord.bookCode },
            data: { stock: borrowRecord.book.stock + 1 },
        });
    
        await this.prisma.borrow.update({
            where: { id: id },
            data: { returnDate: nowDate },
        });
    
        return {
            id: borrowRecord.id,
            memberCode: borrowRecord.memberCode,
            bookCode: borrowRecord.bookCode,
            borrowDate: borrowRecord.borrowDate,
            returnDate: nowDate,
        };
    }
    
}