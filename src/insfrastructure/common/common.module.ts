import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { PrismaService } from '../database/prisma.service';
import { ErrorFilter } from './error.filter';
import { ValidationService } from './validation.service';

@Global()
@Module({
    providers: [
        PrismaService,
        ValidationService, 
        {
            provide: APP_FILTER,
            useClass: ErrorFilter
        }
    ],
    exports: [
        ValidationService,
        PrismaService
    ]
})
export class CommonModule {}
