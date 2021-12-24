import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
  ) { }

  public getTokenForUser(user: User): string {
    return this.jwtService.sign({
      username: user.username,
      sub: user.id,
    });
  }
}
