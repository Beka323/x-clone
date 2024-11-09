import {
    Injectable,
    UnauthorizedException,
    BadRequestException
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "../users/dto/create-user.dto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}
    // Register
    async register(user: CreateUserDto): Promise<{ msg: string }> {
        return this.usersService.register(user);
    }
    // check and return user infi
    async validate(username: string, passWd: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (!user) {
            throw new UnauthorizedException("un authrized user");
        }
        const match = await bcrypt.compare(passWd, user.password);
        if (!match) {
            throw new BadRequestException("incorrect password");
        }
        const { email, __v, password, createdAt, updatedAt, ...rest } =
            user.toObject();
        return rest;
    }
    // Login
    async login(user: any): Promise<{ accessToken: string }> {
        const payload = { id: user._id.toString(), username: user.username };
        const accessToken = await this.jwtService.signAsync(payload);
        return { accessToken };
    }
}
