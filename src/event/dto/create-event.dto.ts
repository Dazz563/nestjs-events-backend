import { IsDateString, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateEventDto {
    @IsNotEmpty({ groups: ['create'] })
    @IsOptional({ groups: ['update'] })
    @IsString()
    @Length(5, 255, { message: 'The name length is wrong' })
    name: string;

    @IsNotEmpty({ groups: ['create'] })
    @IsOptional({ groups: ['update'] })
    @IsString()
    @Length(5, 255)
    description: string;

    @IsNotEmpty({ groups: ['create'] })
    @IsOptional({ groups: ['update'] })
    @IsDateString()
    when: string;

    @IsNotEmpty({ groups: ['create'] })
    @IsOptional({ groups: ['update'] })
    @IsString()
    @Length(5, 255)
    address: string;
}
