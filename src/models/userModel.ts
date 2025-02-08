import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

 const userModel = mongoose.model("User", UserSchema);

 module.exports = userModel