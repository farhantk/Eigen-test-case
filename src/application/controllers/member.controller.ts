// src/controllers/member.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MemberService } from '../../domain/services/member.service';
import { WebResponse } from '../../insfrastructure/common/web.model';
import { CreateMemberDTO, MemberResponse, UpdateMemberDTO } from '../dto/member.dto';

@ApiTags('members')
@Controller('members')
export class MemberController {
    constructor(private readonly memberService: MemberService) {}

    @Get()
    @ApiOperation({ summary: 'Get all members' })
    async getAllMembers(): Promise<WebResponse<MemberResponse[]>> {
        const result = await this.memberService.getAllMembers()
        return {
            data: result
        };
    }

    @Post()
    @ApiOperation({ summary: 'Create a new member' })
    async createMember(@Body() createMemberDto: CreateMemberDTO): Promise<WebResponse<MemberResponse>> {
        const result = await this.memberService.createMember(createMemberDto)
        return {
            data: result
        };
    }

    @Patch(':code')
    @ApiOperation({ summary: 'Update a member' })
    async updateMember(
        @Param('code') code: string,
        @Body() updateMemberDto: UpdateMemberDTO,
    ): Promise<WebResponse<MemberResponse>> {
        const result = await this.memberService.updateMember(code, updateMemberDto)
        return {
            data: result
        }
    }

    @Delete(':code')
    @ApiOperation({ summary: 'Remove a member' })
    async removeMember(@Param('code') code: string): Promise<WebResponse<MemberResponse[]>> {
        const result = await this.memberService.removeMember(code)
        return {
            data: result
        }
    }
}
