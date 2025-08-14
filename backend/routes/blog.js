const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authRequired, allowRoles } = require('../middleware/auth');

router.get('/', (req, res) => {
  db.query('SELECT * FROM blog ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    res.json(rows);
  });
});

router.post('/', authRequired, allowRoles('admin'), (req, res) => {
  const { titre, contenu, image } = req.body;
  if (!titre || !contenu) return res.status(400).json({ message: 'Champs requis manquants' });
  db.query('INSERT INTO blog (titre, contenu, image) VALUES (?,?,?)',
    [titre, contenu, image || null],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur' });
      res.json({ message: 'Article créé', id: result.insertId });
    });
});

module.exports = router;
