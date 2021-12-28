import { BadRequestException, Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { User } from "./entities/user.entity";

@Controller('users')
export class UsersController {
    constructor(
        private readonly authservice: AuthService,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() createAuthDto: CreateAuthDto) {
        const user = new User();

        if (createAuthDto.password !== createAuthDto.password_confirm) {
            throw new BadRequestException(['Passwords are not identical']);
        }

        const existingUser = await this.userRepo.findOne({
            where: [
                { username: createAuthDto.username },
                { email: createAuthDto.email }
            ]
        });

        if (existingUser) {
            throw new BadRequestException(['username or email is already taken']);
        }

        user.username = createAuthDto.username;
        user.password = await this.authservice.hashPassword(createAuthDto.password);
        user.email = createAuthDto.email;
        user.firstName = createAuthDto.firstName;
        user.lastName = createAuthDto.lastName;

        return {
            ...(await this.userRepo.save(user)),
            token: this.authservice.getTokenForUser(user)
        }
    }

}