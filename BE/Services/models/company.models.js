import { Schema, model } from "mongoose";

const companySchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    positions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    password: {
      type: String,
      required: true,
    },
  },

  {
    collection: "company",
  }
);

export default model("Company", companySchema);
