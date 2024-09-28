import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString, Length } from 'class-validator';

export type BorrowResponse = {
  id: number;
  memberCode: string;
  bookCode: string;
  borrowDate: Date;
  returnDate?: Date;
};


export class CreateBorrowDTO {
  @ApiProperty({
    description: "The code of the member",
    example: "M123",
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100, { message: "Member code must be between 1 and 100 characters" })
  memberCode: string;

  @ApiProperty({
    description: "The code of the book",
    example: "B456",
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100, { message: "Book code must be between 1 and 100 characters" })
  bookCode: string;
}

export class UpdateBorrowDTO {
  @ApiProperty({
    description: "The return date of the book",
    example: "2023-09-27T14:20:00.000Z",
    required: false,
  })
  @IsOptional()
  @IsDate({ message: "Return date must be a valid date" })
  returnDate?: Date;
}
