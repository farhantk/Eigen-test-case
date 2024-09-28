import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { BorrowController } from '../../application/controllers/borrow.controller';
import { BorrowResponse, CreateBorrowDTO } from '../../application/dto/borrow.dto';
import { BorrowService } from '../../domain/services/borrow.service';
import { WebResponse } from '../common/web.model';


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
    
    const mockBorrowData: BorrowResponse = {
        id: 1,
        memberCode: 'M001',
        bookCode: 'JK-45',
        borrowDate: new Date(),
    };
    
    const mockBorrowService = {
        getAllBorrows: jest.fn().mockResolvedValue([mockBorrowData]),
        createBorrow: jest.fn().mockResolvedValue(mockBorrowData),
        returnBook: jest.fn().mockResolvedValue(mockBorrowData),
    };
    
    describe('BorrowController', () => {
        let controller: BorrowController;
    
        beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BorrowController],
            providers: [{ provide: BorrowService, useValue: mockBorrowService }],
        }).compile();
    
        controller = module.get<BorrowController>(BorrowController);
        });
    
        describe('GET /borrows', () => {
            it('should get all borrows', async () => {
                const result: WebResponse<BorrowResponse[]> = await controller.getAllBooks();
                expect(result).toEqual({ data: [mockBorrowData] });
                expect(mockBorrowService.getAllBorrows).toHaveBeenCalled();
            });
        });
    
        describe('POST /borrows', () => {
            it('should create a new borrow', async () => {
                const createBorrowDto: CreateBorrowDTO = {
                    memberCode: 'M001',
                    bookCode: 'JK-45',
                };
                const result: WebResponse<BorrowResponse> = await controller.createBorrow(createBorrowDto);
                expect(result).toEqual({ data: mockBorrowData });
                expect(mockBorrowService.createBorrow).toHaveBeenCalledWith(createBorrowDto);
            });
        
            it('should throw an error when creating a borrow for a non-existing member', async () => {
                const createBorrowDto: CreateBorrowDTO = {
                memberCode: 'M999', 
                bookCode: 'JK-45',
                };
                mockBorrowService.createBorrow.mockRejectedValueOnce(new NotFoundException('Member not found'));
                await expect(controller.createBorrow(createBorrowDto)).rejects.toThrow(NotFoundException);
            });
        });
    
        describe('PATCH /borrows/return/:id', () => {
            it('should return a book', async () => {
                const result: WebResponse<BorrowResponse> = await controller.returnBook(1);
                expect(result).toEqual({ data: mockBorrowData });
                expect(mockBorrowService.returnBook).toHaveBeenCalledWith(1);
            });
        
            it('should throw an error if the borrow record does not exist', async () => {
                mockBorrowService.returnBook.mockRejectedValueOnce(new NotFoundException('Borrow record not found'));
                await expect(controller.returnBook(999)).rejects.toThrow(NotFoundException);
            });
        });
    });
});