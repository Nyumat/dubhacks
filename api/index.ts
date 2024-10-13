import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

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

dotenv.config();
const app = express();
const port = 8080;

const router = express.Router();

// Route to create a new user
router.post("/user/create", async (req: any, res: any) => {
  const { userId, email, tracks = [] } = req.query;

  try {
    // Check if a user with this email already exists
    let user = await User.findOne({ email });

    if (user) {
      // User already exists, so you can update the tracks if needed
      user.tracks = tracks;
      const updatedUser = await user.save();
      console.log("User updated successfully:", updatedUser);
      return res.status(200).json(updatedUser);
    }

    // If the user doesn't exist, create a new one
    user = new User({ userId, email, tracks });
    const savedUser = await user.save();
    console.log("User created successfully:", savedUser);
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
});

// Route to fetch a user's tracks
router.get("/user/tracks", async (req: any, res: any) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email }, "tracks"); // Only return the tracks field

    if (!user) {
      console.log("User not found.");
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User's tracks retrieved successfully:", user.tracks);
    res.status(200).json(user.tracks);
  } catch (error) {
    console.error("Error fetching user's tracks:", error);
    res.status(500).json({ error: "Error fetching user's tracks" });
  }
});

// database
mongoose
  .connect(process.env.DB_CONNECT ?? "")
  .then(() => console.log("Successfully connected to database."))
  .catch((err) => console.log(err));
app.use(cors());

app.use("/", router);

app.get("/", (req, res) => {
  // send a simple json response
  res.json({ message: "Hello World!" });
});

// req.isAuthenticated is provided from the auth router
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
