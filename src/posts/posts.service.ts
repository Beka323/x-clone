import {
    Injectable,
    NotFoundException,
    InternalServerErrorException
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Post } from "./schema/posts.schema";
import { Model } from "mongoose";
import { Express } from "express";
import { UsersService } from "../users/users.service";

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>,
        private usersService: UsersService
    ) {}
    async findAll(): Promise<any> {
        const allPost = await this.postModel.find().exec();
        return allPost;
    }
    async getPost(id: string): Promise<any> {
        try {
            const post = await this.postModel.findById(id).exec();
            if (!post) {
                throw new NotFoundException("no post founded");
            }
            return post;
        } catch (err) {
            throw new InternalServerErrorException("some thing went wrong");
        }
    }
    async followingPost(id: string[]): Promise<any> {
        try {
            const posts = await this.postModel
                .find({ createdBy: { $in: id } })
                .exec();
            return posts;
        } catch (error) {
            throw new InternalServerErrorException("some thing went wronge");
        }
    }
    async create(
        post: { post: string },
        image: Express.Multer.File,
        request
    ): Promise<any> {
        const imagePath = request.file
            ? `http://localhost:3000/uploads/${request.file.originalname}`
            : null;
        const newPost = {
            post: post.post,
            createdBy: request.user.id,
            replay: [],
            image: imagePath
        };
        const createPost = new this.postModel(newPost);
        await createPost.save();
        await this.usersService.addPost(
            request.user.id,
            createPost._id.toString()
        );
        return { msg: "posted" };
    }
    async replay(comment: { comment: string }, req, id): Promise<any> {
        const userReplay = {
            id: req.user.id,
            replay: comment.comment
        };
        const addReplay = await this.postModel.findByIdAndUpdate(id, {
            $push: {
                replay: userReplay
            }
        });
        if (!addReplay) {
            throw new NotFoundException("post not founded");
        }
        await addReplay.save();
        return { msg: "done" };
    }
    async likePost(req, id: string): Promise<any> {
        const findPost = await this.getPost(id);
        if (!findPost) {
            throw new NotFoundException("no post founded");
        }
        if (findPost.like.includes(req.user.id)) {
            try {
                const findAndRemove = await this.postModel.findOneAndUpdate(
                    { _id: Object(id) },
                    {
                        $pull: {
                            like: req.user.id
                        }
                    }
                );
                await findAndRemove.save();
                return "unliked";
            } catch {
                throw new InternalServerErrorException("some thing went wrong");
            }

            return "unlikes";
        }
        // ADD like
        try {
            const findAndAdd = await this.postModel.findOneAndUpdate(
                { _id: Object(id) },
                {
                    $push: {
                        like: req.user.id
                    }
                }
            );
            await findAndAdd.save();
            return "liked";
        } catch (err) {
            throw new InternalServerErrorException("some thing went wrong");
            console.log(err);
        }
    }
    // dis like post
    async dislikePost(req, id: string): Promise<any> {
        const findPost = await this.getPost(id);
        if (findPost.dislikes.includes(req.user.id)) {
            try {
                const findAndRemove = await this.postModel.findOneAndUpdate(
                    { _id: Object(id) },
                    {
                        $pull: {
                            dislikes: req.user.id
                        }
                    }
                );
                await findAndRemove.save();
                return "un disliked";
            } catch (err) {
                throw new InternalServerErrorException("something went wrong");
            }
        }
        try {
            const findAndDislike = await this.postModel.findOneAndUpdate(
                { _id: Object(id) },
                {
                    $push: {
                        dislikes: req.user.id
                    }
                }
            );
            await findAndDislike.save();
            return "Dis liked";
        } catch (err) {
            throw new InternalServerErrorException("Some thing went wrong");
        }
    }
    async bookmark(postId: string, req): Promise<any> {
        const findUser = await this.usersService.getUser(req.user.id);
        const findPost = await this.postModel.findById(postId).exec();
        if (!findUser.bookmarks.includes(postId)) {
            findPost.bookmark += 1;
            await findPost.save();
            await this.usersService.addBookmark(postId, req);
            return "added";
        }
        findPost.bookmark -= 1;
        await this.usersService.removeBookmark(postId, req);
        await findPost.save();
        return "removed";
    }
}
