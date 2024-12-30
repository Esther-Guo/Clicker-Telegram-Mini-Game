import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api';

const app = express();
const port = 3000; // or any port you prefer

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});