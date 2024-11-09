import {
    Get,
    Controller,
    Request,
    Post,
    UseGuards,
    ValidationPipe,
    Body
} from "@nestjs/common";
import { LocalAuthGuard } from "./guards/local-auth-guard";
import { AuthService } from "./auth.service";
import { JwtAuthGuards } from "./guards/jwt-guard";
import { CreateUserDto } from "../users/dto/create-user.dto";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("register")
    async register(
        @Body(ValidationPipe) user: CreateUserDto
    ): Promise<{ msg: string }> {
        return this.authService.register(user);
    }
    @UseGuards(LocalAuthGuard)
    @Post("login")
    async(@Request() req): Promise<{ accessToken: string }> {
        return this.authService.login(req.user);
    }
}
