import { Module } from "@nestjs/common";
import { BookController } from "../../application/controllers/book.controller";
import { BookService } from "../../domain/services/book.service";


@Module({
    controllers: [BookController],
    providers: [BookService], 
})
export class BookModule {}