import { Module } from "@nestjs/common";
import { BorrowController } from "../../application/controllers/borrow.controller";
import { BorrowService } from "../../domain/services/borrow.service";

@Module({
    controllers: [BorrowController],
    providers: [BorrowService], 
})
export class BorrowModule {}