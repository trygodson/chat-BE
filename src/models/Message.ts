import mongoose, { Document, Model, Schema } from 'mongoose';
import { RoomDoc } from './Room';
import { UserDoc } from './User';

export interface MessageDoc extends Document {
  message: {
    text: string;
  };
  space: [UserDoc, RoomDoc];
  sender: UserDoc;
}

const MessageSchema = new Schema(
  {
    message: { text: { type: String, required: true } },
    space: [
      { type: Schema.Types.ObjectId, ref: 'user' },
      { type: Schema.Types.ObjectId, ref: 'room' },
    ],
    sender: { type: Schema.Types.ObjectId, ref: 'user' },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: false,
  },
);

const Messages = mongoose.model<MessageDoc>('message', MessageSchema);
export { Messages };
