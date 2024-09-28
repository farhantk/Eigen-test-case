import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { BorrowService } from "../../domain/services/borrow.service";
import { WebResponse } from "../../insfrastructure/common/web.model";
import { BorrowResponse, CreateBorrowDTO } from "../dto/borrow.dto";



@ApiTags('borrows')
@Controller('borrows')
export class BorrowController {
    constructor(
        private readonly borrowService : BorrowService
    ) {}
    
    @ApiOperation({ summary: 'Get all borrow' })
    @Get()
    async getAllBooks(): Promise<WebResponse<BorrowResponse[]>> {
        const result = await this.borrowService.getAllBorrows();
        return {
            data: result
        }
    }

    @Post()
    @ApiOperation({summary: 'Create new borrow'})
    async createBorrow(
        @Body() request: CreateBorrowDTO
    ): Promise<WebResponse<BorrowResponse>>{
        const result = await this.borrowService.createBorrow(request)
        return{
            data: result
        }
    }

    @Patch('return/:id')
    @ApiOperation({summary: 'Return book'})
    async returnBook(
        @Param('id') id: number
    ): Promise<WebResponse<BorrowResponse>>{
        const result = await this.borrowService.returnBook(id)
        return{
            data: result
        }
    }
}