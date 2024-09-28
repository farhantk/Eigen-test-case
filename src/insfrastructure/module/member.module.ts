import { Module } from "@nestjs/common";
import { MemberController } from "../../application/controllers/member.controller";
import { MemberService } from "../../domain/services/member.service";



@Module({
    controllers: [MemberController],
    providers: [MemberService], 
})
export class MemberModule {}