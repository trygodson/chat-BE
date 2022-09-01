import mongoose, { Document, Model, Schema } from 'mongoose';
import { UserDoc } from './User';

export interface RoomDoc extends Document {
  name: string;
  userId: string;
  users: [UserDoc];
}

const RoomSchema = new Schema(
  {
    name: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'user' }],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v, delete ret.createdAt, delete ret.updatedAt;
      },
    },
    timestamps: true,
  },
);

const Room = mongoose.model<RoomDoc>('room', RoomSchema);
export { Room };
