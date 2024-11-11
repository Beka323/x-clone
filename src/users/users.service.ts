import {
    Injectable,
    ConflictException,
    NotFoundException,
    InternalServerErrorException
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./schema/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}
    // Get user by param id
    async getUser(id: string): Promise<any> {
        try {
            const user = await this.userModel.findById(id).exec();
            if (!user) {
                throw new NotFoundException("No User Found");
            }
            user.password = "";
            return user;
        } catch (err) {
            throw new InternalServerErrorException("some thing went wrong");
        }
    }
    // Add Post
    async addPost(id: string, postId: string): Promise<any> {
        try {
            const findAndAdd = await this.userModel.findOneAndUpdate(
                { _id: Object(id) },
                {
                    $push: {
                        posts: postId
                    }
                }
            );
            await findAndAdd.save();
        } catch (err) {
            throw new InternalServerErrorException("some thing went wronge");
        }
    }
    // Register
    async register(user: CreateUserDto): Promise<{ msg: string }> {
        const findUser = await this.findOne(user.username);
        const findUserByEmail = await this.userModel
            .findOne({ email: user.email })
            .exec();
        if (findUser || findUserByEmail) {
            throw new ConflictException("user already exisit");
        }
        const genSalt = await bcrypt.genSalt(10);
        const hashPwd = await bcrypt.hash(user.password, genSalt);
        const newUser = {
            username: user.username,
            email: user.email,
            password: hashPwd,
            age: user.age,
            location: user.location
        };
        const createUser = new this.userModel(newUser);
        await createUser.save();
        return { msg: "created" };
    }
    // Find User by usernamw
    async findOne(username: string): Promise<any | undefined> {
        const user = await this.userModel
            .findOne({ username: username })
            .exec();
        return user;
    }
    // Update userinfo
    async updateUser(req, user: UpdateUserDto): Promise<{ msg: string }> {
        const updateUser = await this.userModel.findByIdAndUpdate(
            req.user.id,
            user
        );
        await updateUser.save();
        return { msg: "updated" };
    }
    // Add and remove follower and follwing
    async addRemove(userId: { id: string; userid: string }): Promise<any> {
        const userOne = await this.getUser(userId.id);
        const userTwo = await this.getUser(userId.userid);
        if (!userOne || !userTwo) {
            throw new NotFoundException("user not found");
        }
        if (userOne.following.includes(userId.userid)) {
            try {
                const removeFollowing = await this.userModel.findOneAndUpdate(
                    { _id: Object(userId.id) },
                    {
                        $pull: {
                            following: userId.userid
                        }
                    }
                );
                const removeFollower = await this.userModel.findOneAndUpdate(
                    { _id: Object(userId.userid) },
                    {
                        $pull: {
                            followers: userId.id
                        }
                    }
                );
                await removeFollowing.save();
                await removeFollower.save();
                return "un followed";
            } catch (err) {
                throw new InternalServerErrorException("some thing went wrong");
            }
        }
        try {
            const addFollowing = await this.userModel.findOneAndUpdate(
                { _id: Object(userId.id) },
                {
                    $push: {
                        following: userId.userid
                    }
                }
            );
            const addFollower = await this.userModel.findOneAndUpdate(
                { _id: Object(userId.userid) },
                {
                    $push: {
                        followers: userId.id
                    }
                }
            );
            await addFollower.save();
            await addFollowing.save();
            return "followed";
        } catch (err) {
            throw new InternalServerErrorException("something went wrong");
        }
    }
    //usersuggestion ( people you might know)
    async suggestion(): Promise<any> {
        const suggest = await this.userModel.find().limit(5).exec();

        return suggest.map(user => {
            return {
                id: user._id.toString(),
                username: user.username,
                location: user.location,
                age: user.age
            };
        });
    }
    async addBookmark(postId: string, req) {
        try {
            const findUser = await this.userModel.findById(req.user.id);
            findUser.bookmarks.push(postId);
            await findUser.save();
        } catch (err) {
            throw new InternalServerErrorException(
                "something went wronge you will fix it soon"
            );
        }
    }
    async removeBookmark(postId: string, req) {
        try {
            const rmBoorkmark = await this.userModel.findByIdAndUpdate(
                req.user.id,
                {
                    $pull: {
                        bookmarks: postId
                    }
                }
            );
            await rmBoorkmark.save();
        } catch (err) {
            throw new InternalServerErrorException("smtg went wronge");
        }
    }
}
