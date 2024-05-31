import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    readTime: {
      value: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        required: true,
      },
    },
    company: {
      name: {
        type: String,
        required: true,
      },
      logo: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    collection: "posts",
    timestamps: true,
  }
);

export default mongoose.model("Post", postSchema);
