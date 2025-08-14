const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authRequired } = require('../middleware/auth');

router.get('/', (req, res) => {
  const { type, ville, duree } = req.query;
  let sql = "SELECT o.*, u.nom AS auteur FROM offres o JOIN utilisateurs u ON u.id=o.id_offreur WHERE 1=1";
  const params = [];
  if (type) { sql += " AND (o.titre LIKE ? OR o.description LIKE ?)"; params.push(`%${type}%`, `%${type}%`); }
  if (ville) { sql += " AND o.ville LIKE ?"; params.push(`%${ville}%`); }
  if (duree) { sql += " AND o.duree LIKE ?"; params.push(`%${duree}%`); }
  sql += " ORDER BY o.created_at DESC";
  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    res.json(rows);
  });
});

router.post('/', authRequired, (req, res) => {
  const { titre, description, duree, periode, conditions, ville } = req.body;
  const id_offreur = req.user.id;
  if (!titre || !description) return res.status(400).json({ message: 'Champs requis manquants' });
  db.query(
    'INSERT INTO offres (titre, description, duree, periode, conditions, ville, id_offreur) VALUES (?,?,?,?,?,?,?)',
    [titre, description, duree, periode, conditions, ville, id_offreur],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur' });
      res.json({ message: 'Offre créée', id: result.insertId });
    }
  );
});

router.put('/:id', authRequired, (req, res) => {
  const { id } = req.params;
  const { titre, description, duree, periode, conditions, ville } = req.body;
  db.query('UPDATE offres SET titre=?, description=?, duree=?, periode=?, conditions=?, ville=? WHERE id=? AND id_offreur=?',
    [titre, description, duree, periode, conditions, ville, id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur' });
      if (result.affectedRows === 0) return res.status(403).json({ message: 'Non autorisé' });
      res.json({ message: 'Offre mise à jour' });
    });
});

router.delete('/:id', authRequired, (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM offres WHERE id=? AND id_offreur=?', [id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    if (result.affectedRows === 0) return res.status(403).json({ message: 'Non autorisé' });
    res.json({ message: 'Offre supprimée' });
  });
});

module.exports = router;
