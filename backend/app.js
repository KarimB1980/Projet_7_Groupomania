// Framework Express
const express = require('express');
// Base de données MongoDB
const mongoose = require('mongoose');
const app = express();
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
require('dotenv').config();

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGODB_PATH,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Middleware 
// Headers premettant :
// - d'accéder à notre API depuis n'importe quelle origine ( '*' )
// - d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.)
// - d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Prise en charge du JSON.
app.use(express.json());

// Création d'un dossier images si inexistant 
const fs = require('fs');
const folderName = './images';
try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
} catch (err) {
  console.error(err);
}

// Chemin statique pour fournir les images
app.use('/images', express.static(('images')));

app.use('/api/auth', userRoutes);
app.use('/api/posts', postRoutes);

module.exports = app;