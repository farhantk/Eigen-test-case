import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { BookResponse, CreateBookDTO, UpdateBookDTO } from '../../application/dto/books.dto';
import { BookController } from '../../application/controllers/book.controller';
import { BookService } from '../../domain/services/book.service';


describe('Book Test', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();
  });

  const mockBookData: BookResponse = {
    code: '123',
    title: 'Test Book',
    author: 'Test Author',
    stock: 5,
  };
  
  const mockBookService = {
    getAllBooks: jest.fn().mockResolvedValue([mockBookData]),
    getAllBooksAvailable: jest.fn().mockResolvedValue([mockBookData]),
    createBook: jest.fn().mockResolvedValue(mockBookData),
    updateBook: jest.fn().mockResolvedValue(mockBookData),
    removeBook: jest.fn().mockResolvedValue([mockBookData]),
  };
  
  describe('BookController', () => {
    let controller: BookController;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [BookController],
        providers: [
          { provide: BookService, useValue: mockBookService },
        ],
      }).compile();
  
      controller = module.get<BookController>(BookController);
    });
  
    describe('GET /books', () => {
      it('should get all books', async () => {
        const result = await controller.getAllBooks();
        expect(result).toEqual({ data: [mockBookData] });
        expect(mockBookService.getAllBooks).toHaveBeenCalled();
      });
    });
  
    describe('GET /books/avail', () => {
      it('should get all available books', async () => {
        const result = await controller.getAllBooksAvailable();
        expect(result).toEqual({ data: [mockBookData] });
        expect(mockBookService.getAllBooksAvailable).toHaveBeenCalled();
      });
    });
  
    describe('POST /books/create', () => {
      it('should create a book', async () => {
        const createBookDto: CreateBookDTO = {
          code: '123',
          title: 'Test Book',
          author: 'Test Author',
          stock: 5,
        };
        const result = await controller.addBook(createBookDto);
        expect(result).toEqual({ data: mockBookData });
        expect(mockBookService.createBook).toHaveBeenCalledWith(createBookDto);
      });
  
      it('should throw an error when creating a book with existing code', async () => {
        const createBookDto: CreateBookDTO = {
          code: '123',
          title: 'Test Book',
          author: 'Test Author',
          stock: 5,
        };
        mockBookService.createBook.mockRejectedValueOnce(new BadRequestException('Book with this code already exists'));
        await expect(controller.addBook(createBookDto)).rejects.toThrow(BadRequestException);
      });
    });
  
    describe('PATCH /books/update/:code', () => {
      it('should update a book', async () => {
        const updateBookDto: UpdateBookDTO = {
          title: 'Updated Title',
          author: 'Updated Author',
          stock: 10,
        };
        const result = await controller.updateBook('123', updateBookDto);
        expect(result).toEqual({ data: mockBookData });
        expect(mockBookService.updateBook).toHaveBeenCalledWith('123', updateBookDto);
      });
  
      it('should throw an error if book to update does not exist', async () => {
        const updateBookDto: UpdateBookDTO = {
          title: 'Updated Title',
          author: 'Updated Author',
          stock: 10,
        };
        mockBookService.updateBook.mockRejectedValueOnce(new NotFoundException('Book not found'));
        await expect(controller.updateBook('999', updateBookDto)).rejects.toThrow(NotFoundException);
      });
    });
  
    describe('DELETE /books/remove/:code', () => {
      it('should remove a book', async () => {
        const result = await controller.removeBook('123');
        expect(result).toEqual({ data: [mockBookData] });
        expect(mockBookService.removeBook).toHaveBeenCalledWith('123');
      });
  
      it('should throw an error if book to remove does not exist', async () => {
        mockBookService.removeBook.mockRejectedValueOnce(new NotFoundException('Book not found'));
        await expect(controller.removeBook('999')).rejects.toThrow(NotFoundException);
      });
    });
  });
});
