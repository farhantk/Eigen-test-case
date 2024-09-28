import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookService } from '../../domain/services/book.service';
import { WebResponse } from '../../insfrastructure/common/web.model';
import { BookResponse, CreateBookDTO, UpdateBookDTO } from '../dto/books.dto';

@ApiTags('books')
@Controller('books') 
export class BookController {
    constructor(
      private readonly bookService: BookService,
    ) {}

    @ApiOperation({ summary: 'Get all books' })
    @Get()
    async getAllBooks(): Promise<WebResponse<BookResponse[]>> {
      const result = await this.bookService.getAllBooks();
      return {
        data: result
      }
    }

    @ApiOperation({ summary: 'Get all available books' })
    @Get('avail')
    async getAllBooksAvailable(): Promise<WebResponse<BookResponse[]>> {
      const result = await this.bookService.getAllBooksAvailable();
      return {
        data: result
      }
    }

    @ApiOperation({ summary: 'Create book' })
    @Post('/create')
    async addBook(
      @Body() request: CreateBookDTO,
    ): Promise<WebResponse<BookResponse>> {
      const result = await this.bookService.createBook(request);
      return {
        data: result
      }
    }

    @ApiOperation({ summary: 'Update book details' })
    @Patch('/update/:code')
    async updateBook(
      @Param('code') code: string,
      @Body() request: UpdateBookDTO,
    ): Promise<WebResponse<BookResponse>> {
      const updatedBook = await this.bookService.updateBook(code, request);
      return {
        data: updatedBook
      };
    }

    @ApiOperation({ summary: 'Remove a book' })
    @Delete('/remove/:code')
    async removeBook(@Param('code') code: string): Promise<WebResponse<BookResponse[]>> {
      const result = await this.bookService.removeBook(code);
      return {
        data: result 
      };
    }
}
