import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuards } from "../auth/guards/jwt-guard";
import { FeedsService } from "./feeds.service";

@Controller("feeds")
export class FeedsController {
    constructor(private feedsService: FeedsService) {}
    @UseGuards(JwtAuthGuards)
    @Get("foryou")
    async foryou(@Request() request): Promise<any> {
        return this.feedsService.foryou(request)
    }
    @UseGuards(JwtAuthGuards)
    @Get("following")
    async follwing(@Request() request): Promise<any> {
        return this.feedsService.follwing(request)
    }
}
