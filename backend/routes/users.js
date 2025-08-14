const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authRequired } = require('../middleware/auth');

router.get('/demandeurs', (req, res) => {
  const { ville, competences, disponibilite } = req.query;
  let sql = "SELECT id, nom, email, role, photo, resume, competences, ville, disponibilite FROM utilisateurs WHERE role='demandeur'";
  const params = [];
  if (ville) { sql += " AND ville LIKE ?"; params.push(`%${ville}%`); }
  if (competences) { sql += " AND competences LIKE ?"; params.push(`%${competences}%`); }
  if (disponibilite) { sql += " AND disponibilite LIKE ?"; params.push(`%${disponibilite}%`); }
  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  db.query('SELECT id, nom, email, role, photo, resume, competences, ville, disponibilite FROM utilisateurs WHERE id = ?', [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur' });
      if (!rows || rows.length === 0) return res.status(404).json({ message: 'Profil introuvable' });
      res.json(rows[0]);
    });
});

router.put('/me', authRequired, (req, res) => {
  const { nom, resume, competences, ville, disponibilite, photo } = req.body;
  db.query(
    'UPDATE utilisateurs SET nom=?, resume=?, competences=?, ville=?, disponibilite=?, photo=? WHERE id=?',
    [nom, resume, competences, ville, disponibilite, photo, req.user.id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur' });
      res.json({ message: 'Profil mis à jour' });
    }
  );
});

module.exports = router;
