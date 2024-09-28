import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { CreateMemberDTO, MemberResponse, UpdateMemberDTO } from '../../application/dto/member.dto';
import { MemberController } from '../../application/controllers/member.controller';
import { MemberService } from '../../domain/services/member.service';


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

  const mockMemberData: MemberResponse = {
    code: 'member1',
    name: 'John Doe',
    penaltyUntil: undefined,
    borrowedBooks: [],
  };
  
  const mockMemberService = {
    getAllMembers: jest.fn().mockResolvedValue([mockMemberData]),
    createMember: jest.fn().mockResolvedValue(mockMemberData),
    updateMember: jest.fn().mockResolvedValue(mockMemberData),
    removeMember: jest.fn().mockResolvedValue([mockMemberData]),
  };
  
  describe('MemberController', () => {
    let controller: MemberController;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [MemberController],
        providers: [
          { provide: MemberService, useValue: mockMemberService },
        ],
      }).compile();
  
      controller = module.get<MemberController>(MemberController);
    });
  
    describe('GET /members', () => {
      it('should get all members', async () => {
        const result = await controller.getAllMembers();
        expect(result).toEqual({ data: [mockMemberData] });
        expect(mockMemberService.getAllMembers).toHaveBeenCalled();
      });
    });
  
    describe('POST /members', () => {
      it('should create a member', async () => {
        const createMemberDto: CreateMemberDTO = {
          code: 'member2',
          name: 'Jane Smith',
        };
        const result = await controller.createMember(createMemberDto);
        expect(result).toEqual({ data: mockMemberData });
        expect(mockMemberService.createMember).toHaveBeenCalledWith(createMemberDto);
      });
  
      it('should throw an error when creating a member with existing code', async () => {
        const createMemberDto: CreateMemberDTO = {
          code: 'member1',
          name: 'Duplicate Member',
        };
        mockMemberService.createMember.mockRejectedValueOnce(new BadRequestException('Member with this code already exists'));
        await expect(controller.createMember(createMemberDto)).rejects.toThrow(BadRequestException);
      });
    });
  
    describe('PATCH /members/:code', () => {
      it('should update a member', async () => {
        const updateMemberDto: UpdateMemberDTO = {
          name: 'John Updated',
        };
        const result = await controller.updateMember('member1', updateMemberDto);
        expect(result).toEqual({ data: mockMemberData });
        expect(mockMemberService.updateMember).toHaveBeenCalledWith('member1', updateMemberDto);
      });
  
      it('should throw an error if member to update does not exist', async () => {
        const updateMemberDto: UpdateMemberDTO = {
          name: 'Nonexistent Member',
        };
        mockMemberService.updateMember.mockRejectedValueOnce(new NotFoundException('Member not found'));
        await expect(controller.updateMember('nonexistent', updateMemberDto)).rejects.toThrow(NotFoundException);
      });
    });
  
    describe('DELETE /members/:code', () => {
      it('should remove a member', async () => {
        const result = await controller.removeMember('member1');
        expect(result).toEqual({ data: [mockMemberData] });
        expect(mockMemberService.removeMember).toHaveBeenCalledWith('member1');
      });
  
      it('should throw an error if member to remove does not exist', async () => {
        mockMemberService.removeMember.mockRejectedValueOnce(new NotFoundException('Member not found'));
        await expect(controller.removeMember('nonexistent')).rejects.toThrow(NotFoundException);
      });
    });
  });
});
