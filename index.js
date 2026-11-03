
import express from "express";
import cors from "cors";
import { connectToMongoDB } from "./config/db.js";
import eventRoutes from "./routes/eventRoutes.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.use("/events", eventRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

const startServer = async () => {
  try {
    await connectToMongoDB();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
