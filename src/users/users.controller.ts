import {
    Controller,
    Patch,
    Get,
    ValidationPipe,
    Request,
    Body,
    UseGuards,
    Param
} from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";
import { JwtAuthGuards } from "../auth/guards/jwt-guard";
@Controller("users")
export class UsersController {
    constructor(private usersService: UsersService) {}
    @UseGuards(JwtAuthGuards)
    @Get("user/:id")
    async findUser(@Param("id") id: string): Promise<any> {
        return this.usersService.getUser(id);
    }
    @UseGuards(JwtAuthGuards)
    @Get("suggest")
    async suggest(): Promise<any> {
        return this.usersService.suggestion();
    }
    @UseGuards(JwtAuthGuards)
    @Patch("updateuser")
    async updateProfile(
        @Request() req,
        @Body() user: UpdateUserDto
    ): Promise<{ msg: string }> {
        return this.usersService.updateUser(req, user);
    }
    @UseGuards(JwtAuthGuards)
    @Patch("follow/:id/:userid")
    async followUnfollo(
        @Param() userId: { id: string; userid: string }
    ): Promise<any> {
        return this.usersService.addRemove(userId);
    }
}
