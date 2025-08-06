import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UGender, URole } from 'src/enum';

export class ProfileResponseDto {
    @ApiProperty()
    uuid: string;
    @ApiProperty()
    firstname: string;
    @ApiProperty()
    lastname: string;
    @ApiProperty()
    email: string;
    @ApiProperty({ enum: UGender })
    gender: UGender;
    @ApiProperty()
    phoneNumber: string;
    @ApiProperty()
    dateOfBirth: Date;
    @ApiProperty({ enum: URole })
    role: URole;

    @Exclude()
    password: string;
    @Exclude()
    deletedStatus: boolean;
    @Exclude()
    doneBy: string | null;
    @Exclude()
    updatedBy: string | null;

    @Expose()
    createdAt: Date;
    @Expose()
    updatedAt: Date;

    constructor(partial: Partial<ProfileResponseDto>) {
        Object.assign(this, partial);
    }
}
