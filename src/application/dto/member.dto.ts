// src/application/dto/members.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMemberDTO {
  @ApiProperty({ description: 'Unique code for the member', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  code: string;

  @ApiProperty({ description: 'Name of the member', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}

export class UpdateMemberDTO {
  @ApiProperty({ description: 'Name of the member', required: false, maxLength: 100 })
  @IsString()
  @MaxLength(100)
  name?: string;
}

export type MemberResponse = {
  code: string;
  name: string;
  penaltyUntil?: Date;
  borrowedBooks?: any[];
};
