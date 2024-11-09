import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
type postTypes = HydratedDocument<Post>;

@Schema({
    timestamps: true
})
export class Post {
    @Prop({ type: String })
    post: string;
    @Prop({ type: String })
    createdBy: string;
    @Prop({
        id: { type: String },
        comment: { type: String }
    })
    replay: { id: string; comment: string }[];
    @Prop({type:[String],default:[]})
    like: string[]
    @Prop({type:[String], default:[]})
    dislikes: string[]
    @Prop({ type: Number, default: 0 })
    bookmark: number;
    @Prop({ type: String })
    image: string;
}
export const PostSchema = SchemaFactory.createForClass(Post);
