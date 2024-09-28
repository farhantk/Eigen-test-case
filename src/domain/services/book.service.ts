import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Book } from '@prisma/client';
import { BookResponse, CreateBookDTO, UpdateBookDTO } from '../../application/dto/books.dto';

import { PrismaService } from '../../insfrastructure/database/prisma.service';

@Injectable()
export class BookService {
  constructor(
    private prisma: PrismaService
    ) {}

    private async validateUniqueCode(code: string): Promise<BookResponse> {
        const existingBook = await this.prisma.book.findUnique({
          where: { code },
        });
        return existingBook
    }
    
    async getAllBooks(): Promise<BookResponse[]> {
        return this.prisma.book.findMany({
            include: {
                borrowedBooks: {
                    where: {
                        returnDate: null,
                    },
                    include: {
                        member: true,
                    },
                },
            },
        });
    }

    async getAllBooksAvailable(): Promise<BookResponse[]> {
        return this.prisma.book.findMany({
            where: {
                stock: {
                    gt: 0,
                },
            },
        });
    }

    async createBook(createBookDto: CreateBookDTO): Promise<BookResponse> {
        const existingBook = await this.validateUniqueCode(createBookDto.code)

        if (existingBook) {
            throw new BadRequestException('Book with this code already exists');
        }

        const newBook = await this.prisma.book.create({
            data: createBookDto,
        });

        return newBook;
    }

    async updateBook(code: string, updateBookDto: UpdateBookDTO): Promise<BookResponse> {
        const existingBook = await this.validateUniqueCode(code)

        if (!existingBook) {
            throw new NotFoundException('Book not found');
        }

        const updatedBook = await this.prisma.book.update({
            where: { code },
            data: updateBookDto
        });

        return updatedBook
    }

    async removeBook(code: string): Promise<BookResponse[]> {
        const existingBook = await this.validateUniqueCode(code)

        if (!existingBook) {
        throw new NotFoundException('Book not found');
        }

        await this.prisma.book.delete({ where: { code } });

        return this.getAllBooks()
    }
}
