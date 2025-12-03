// src/models/comment.ts
import mongoose, { Schema } from 'mongoose'

const commentSchema = new Schema(
  {
    user: { type: String, required: true },
    course: { type: String, required: true },
    content: { type: String, required: true },
    contentRate: { type: Number, default: 0 },
    homeworkRate: { type: Number, default: 0 },
    examRate: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    likedUsers: { type: [String], default: [] },
  },
  { timestamps: true }
)

export default mongoose.models.Comment ||
  mongoose.model('Comment', commentSchema)
