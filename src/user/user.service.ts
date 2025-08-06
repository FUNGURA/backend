import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { plainToInstance } from 'class-transformer';
import { ProfileResponseDto } from './dto/profile-response.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async getProfile(userId: string) {
        const user = await this.userRepo.findOne({ where: { uuid: userId } });
        if (!user) throw new NotFoundException('User not found');

        return plainToInstance(ProfileResponseDto, user);
    }

    async updateProfile(userId: string, dto: UpdateProfileDto) {
        const user = await this.userRepo.findOne({ where: { uuid: userId } });
        if (!user) throw new NotFoundException('User not found');

        Object.assign(user, dto);
        return await this.userRepo.save(user);
    }
}
