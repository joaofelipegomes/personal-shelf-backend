import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes';

dotenv.config();

const app = express();

const isDev = process.env.NODE_ENV === 'development';
const allowedOrigin = isDev ? 'http://localhost:5173' : 'https://colagem.app';

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Routes
app.use('/', apiRoutes);

app.get('/', (req, res) => {
  res.send('Personal Shelf Backend API is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
