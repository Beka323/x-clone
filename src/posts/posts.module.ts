import { Module } from "@nestjs/common";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { Post, PostSchema } from "./schema/posts.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Post.name,
                schema: PostSchema
            }
        ]),
        UsersModule
    ],
    controllers: [PostsController],
    providers: [PostsService],
    exports:[PostsService]
})
export class PostsModule {}
