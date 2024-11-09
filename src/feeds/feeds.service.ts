import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { PostsService } from "../posts/posts.service";

@Injectable()
export class FeedsService {
    constructor(
        private usersService: UsersService,
        private postsService: PostsService
    ) {}
    async foryou(req) {
      const posts = await this.postsService.findAll()
      return posts
    }
    async follwing(req) {
      const findUser = await this.usersService.getUser(req.user.id)
      const posts =  await this.postsService.followingPost(findUser.following)
    return posts
    }
}
