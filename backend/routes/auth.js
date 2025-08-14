const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

router.post('/register', async (req, res) => {
  const { nom, email, password, role } = req.body;
  if (!nom || !email || !password) return res.status(400).json({ message: 'Champs requis manquants' });
  try {
    const hash = await bcrypt.hash(password, 10);
    db.query('INSERT INTO utilisateurs (nom,email,password,role) VALUES (?,?,?,?)',
      [nom, email, hash, role || 'demandeur'],
      (err) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Email déjà utilisé' });
          return res.status(500).json({ message: 'Erreur serveur', err });
        }
        res.json({ message: 'Compte créé' });
      });
  } catch (e) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM utilisateurs WHERE email = ?', [email], async (err, rows) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    if (!rows || rows.length === 0) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Mot de passe incorrect' });
    const token = jwt.sign({ id: user.id, role: user.role, nom: user.nom }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '2h' });
    res.json({ token, user: { id: user.id, nom: user.nom, email: user.email, role: user.role } });
  });
});

module.exports = router;
