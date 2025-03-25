import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import routes from './routes/index.js';
import connectDB from './config/db.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 8000;

const server = createServer(app);

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("It's working 🙌");
});
app.use('/api', routes);

server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});