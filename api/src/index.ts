import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "../routes/users";

dotenv.config();
const app = express();
const port = 8080;

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
