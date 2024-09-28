import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';

export type BookResponse = {
  code: string;
  title: string;
  author: string;
  stock: number;
};

export class CreateBookDTO {
  @ApiProperty({ description: 'Unique code for the book', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  code: string;

  @ApiProperty({ description: 'Title of the book', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({ description: 'Author of the book', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  author: string;

  @ApiProperty({ description: 'Number of copies available', type: Number })
  @IsInt()
  @IsPositive()
  stock: number;
}

export class UpdateBookDTO {
  @ApiProperty({ description: 'Title of the book', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({ description: 'Author of the book', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  author: string;

  @ApiProperty({ description: 'Number of copies available', type: Number })
  @IsInt()
  @IsPositive()
  stock: number;
}
