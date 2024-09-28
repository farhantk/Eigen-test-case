// src/application/services/member.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MemberResponse, CreateMemberDTO, UpdateMemberDTO } from '../../application/dto/member.dto';
import { PrismaService } from '../../insfrastructure/database/prisma.service';


@Injectable()
export class MemberService {
    constructor(private prisma: PrismaService) {}

    async getAllMembers(): Promise<MemberResponse[]> {
        return this.prisma.member.findMany({
            include: {
                borrowedBooks: {
                    where: {
                        returnDate: null,
                    },
                    include: {
                        book: true,
                    },
                },
            },
        });
    }

    async createMember(createMemberDto: CreateMemberDTO): Promise<MemberResponse> {
        const existingMember = await this.prisma.member.findUnique({
            where: { code: createMemberDto.code },
        });

        if (existingMember) {
            throw new BadRequestException('Member with this code already exists');
        }

        const newMember = await this.prisma.member.create({
            data: {
                code: createMemberDto.code,
                name: createMemberDto.name
            },
        });

        return newMember;
    }

    async updateMember(code: string, updateMemberDto: UpdateMemberDTO): Promise<MemberResponse> {
        const existingMember = await this.prisma.member.findUnique({
            where: { code },
        });

        if (!existingMember) {
            throw new NotFoundException('Member not found');
        }

        const updatedMember = await this.prisma.member.update({
            where: { code },
            data: {
                name: updateMemberDto.name ?? existingMember.name
            },
        });

        return updatedMember;
    }

    async removeMember(code: string): Promise<MemberResponse[]> {
        const existingMember = await this.prisma.member.findUnique({
        where: { code },
        });

        if (!existingMember) {
        throw new NotFoundException('Member not found');
        }

        await this.prisma.member.delete({ where: { code } });

        return this.getAllMembers();
    }
}
