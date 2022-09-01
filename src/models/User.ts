import mongoose, { Document, Model, Schema } from 'mongoose';
import { RoomDoc } from './Room';

export interface UserDoc extends Document {
  username: string;
  email: string;
  salt: string;
  password: string;
  room: RoomDoc;
  permission: [string];
}

const UserSchema = new Schema(
  {
    username: { type: String, required: true, min: 3, max: 20 },
    salt: { type: String, required: true },
    permission: { type: [String] },
    email: { type: String, required: true, unique: true, max: 50 },
    room: { type: Schema.Types.ObjectId, ref: 'room' },
    password: { type: String, required: true, min: 6, max: 14 },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret._id;
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  },
);

const User = mongoose.model<UserDoc>('user', UserSchema);
export { User };
