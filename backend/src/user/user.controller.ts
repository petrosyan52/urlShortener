import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import {SkipThrottle} from "@nestjs/throttler";

@Controller('auth')
export class UserController {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    @Post('register')
    async register(@Body() body: { email: string; password: string }) {
        const { email, password } = body;
        if (!email || !password) throw new BadRequestException('Email and password are required');

        const user = await this.userService.create(email, password);
        return { message: 'User registered successfully', userId: user.id };
    }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const { email, password } = body;
        if (!email || !password) throw new BadRequestException('Email and password are required');

        const user = await this.userService.validateUser(email, password);
        if (!user) throw new BadRequestException('Invalid credentials');

        const payload = { sub: user.id, email: user.email };
        const token = this.jwtService.sign(payload);

        return { access_token: token };
    }
}
