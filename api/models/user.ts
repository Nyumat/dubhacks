import mongoose from "mongoose";

const Schema = mongoose.Schema;

const sample = new Schema({
  url: String,
  name: String,
});

const track = new Schema({
  id: String,
  samples: [sample],
  numOfSteps: Number,
  checkedSteps: [String],
});

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  tracks: [track],
});

const User = mongoose.model("User", userSchema);
export { User };
