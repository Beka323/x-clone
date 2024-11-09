import {
    Controller,
    UseGuards,
    Get,
    Post,
    Patch,
    Param,
    Body,
    UseInterceptors,
    UploadedFile,
    Request
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { JwtAuthGuards } from "../auth/guards/jwt-guard";
import { PostsService } from "./posts.service";
import { diskStorage } from "multer";
@Controller("posts")
export class PostsController {
    constructor(private postsService: PostsService) {}
    @UseGuards(JwtAuthGuards)
    @Get(":id")
    async getPost(@Param("id") id: string): Promise<any> {
        return this.postsService.getPost(id);
    }
    @UseGuards(JwtAuthGuards)
    @UseInterceptors(
        FileInterceptor("image", {
            storage: diskStorage({
                destination: function (req, files, cb) {
                    cb(null, "uploads/");
                },
                filename: function (req, files, cb) {
                    cb(null, files.originalname);
                }
            })
        })
    )
    @Post("create")
    async createOne(
        @Body() post: { post: string },
        @UploadedFile() image: Express.Multer.File | undefined,
        @Request() req
    ): Promise<any> {
        return this.postsService.create(post, image, req);
    }
    @UseGuards(JwtAuthGuards)
    @Patch("comment/:id")
    async replay(
        @Body() comment: { comment: string },
        @Request() request,
        @Param("id") id: string
    ): Promise<any> {
        return this.postsService.replay(comment, request, id);
    }
    @UseGuards(JwtAuthGuards)
    @Patch("like/:id")
    async likePost(@Request() req, @Param("id") id: string): Promise<any> {
        return this.postsService.likePost(req, id);
    }
    @UseGuards(JwtAuthGuards)
    @Patch("dislike/:id")
    async dislikePost(@Request() req, @Param("id") id: string): Promise<any> {
        return this.postsService.dislikePost(req, id);
    }
    @UseGuards(JwtAuthGuards)
    @Patch("bookmark/:id")
    async bookmark(@Param("id") id: string, @Request() req): Promise<any> 
    {
    return this.postsService.bookmark(id,req);
    }
}
