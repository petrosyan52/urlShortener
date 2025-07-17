import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
    ) {}

    async findByEmail(email: string): Promise<User | undefined> {
        return this.userRepo.findOne({ where: { email } });
    }

    async create(email: string, password: string): Promise<User> {
        const existing = await this.findByEmail(email);
        if (existing) throw new ConflictException('Email already in use');

        const passwordHash = await bcrypt.hash(password, 10);
        const user = this.userRepo.create({ email, passwordHash });
        return this.userRepo.save(user);
    }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.findByEmail(email);
        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return null;

        return user;
    }

    async findById(id: number): Promise<User | undefined> {
        return this.userRepo.findOne({ where: { id } });
    }

}
