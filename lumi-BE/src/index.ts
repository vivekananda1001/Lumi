import express, { Application, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import Routes from "./routes/index.js";
import { createServer } from "http";

const app: Application = express();
const PORT = process.env.PORT || 8000;

const server = createServer(app);

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  return res.send("It's working 🙌");
});

// Routes
app.use('/api',Routes)

server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
