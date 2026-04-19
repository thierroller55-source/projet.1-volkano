require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors'); // 1. On importe CORS
const connectDB = require('./src/config/db');
const hotelRoutes = require('./src/routes/hotelRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

// --- CONNEXION BASE DE DONNÉES ---
connectDB();

// --- MIDDLEWARES ---
app.use(cors()); // 2. On autorise les connexions (INDISPENSABLE)
app.use(express.json());

// Servir les fichiers statiques (ton frontend)
app.use(express.static(path.join(__dirname, 'frontend')));

// --- ROUTES API ---
app.use('/api/hotels', hotelRoutes);
app.use('/api/auth', authRoutes);

// Route par défaut
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// --- LANCEMENT ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});