import { Module } from "@nestjs/common";
import { FeedsController } from "./feeds.controller";
import { FeedsService } from "./feeds.service";
import { PostsModule } from "../posts/posts.module";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [PostsModule, UsersModule],
    controllers: [FeedsController],
    providers: [FeedsService]
})
export class FeedsModule {}
