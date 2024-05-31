import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    bornDate: {
      type: String,
      required: false,
    },

    avatar: {
      type: String,
      required: false,
    },

    username: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
  },

  // Questo ci permette di inserire i documenti che seguono questo schema nella collezione users
  {
    collection: "users",
  }
);

// Esportiamo un modello chiamato "User" che rispecchi lo schema userSchema
export default model("User", userSchema);
