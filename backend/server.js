const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir le frontend statique
app.use('/', express.static(path.join(__dirname, '..', 'frontend')));

// Routes API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/blog', require('./routes/blog'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`BARABAY API running on port ${PORT}`));
