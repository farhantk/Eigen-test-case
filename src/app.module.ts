import { Module } from '@nestjs/common';
import { CommonModule } from './insfrastructure/common/common.module';
import { BookModule } from './insfrastructure/module/book.module';
import { BorrowModule } from './insfrastructure/module/borrow.module';
import { MemberModule } from './insfrastructure/module/member.module';

@Module({
  imports: [
    CommonModule,
    BookModule,
    MemberModule,
    BorrowModule
  ],
  controllers: [
  ],
  providers: [
  ],
})
export class AppModule {}
