import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
type user = HydratedDocument<User>;
@Schema({
    timestamps: true
})
export class User {
    @Prop({ type: String })
    username: string;
    @Prop({ type: String, unique: true })
    email: string;
    @Prop({ type: String })
    password: string;
    @Prop({ type: String })
    location: string;
    @Prop({ type: Number })
    age: number;

    @Prop({ type: [String], default: [] })
    followers: string[];
    @Prop({ type: [String], default: [] })
    following: string[];
    @Prop({ type: [String], default: [] })
    posts: [];
    @Prop({ type: [String], default: [] })
    bookmarks: string[];
}
export const UserSchema = SchemaFactory.createForClass(User);
