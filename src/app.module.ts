import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { PostsModule } from './posts/posts.module';
import { FeedsModule } from './feeds/feeds.module';

@Module({
    imports: [
        UsersModule,
        AuthModule,
        ConfigModule.forRoot({
            isGlobal: true
        }),
        MongooseModule.forRoot(process.env.DATABASE_URL),
        PostsModule,
        FeedsModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
