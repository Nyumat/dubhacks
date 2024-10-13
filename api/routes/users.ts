import express from "express";
import { User } from "../models/user";
const router = express.Router();

// Route to create a new user
router.post("/user/create", async (req, res) => {
  const { email, tracks = [] } = req.body;

  try {
    const user = new User({ email, tracks });
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

export default router;