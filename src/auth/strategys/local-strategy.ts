import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }
    async validate(
        username: string,
        password: string
    ): Promise<{ username: string; id: string }> {
        const user = await this.authService.validate(username, password);
        return user;
    }
}
