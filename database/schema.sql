CREATE TABLE IF NOT EXISTS utilisateurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('demandeur','offreur','admin') NOT NULL DEFAULT 'demandeur',
  photo VARCHAR(255),
  resume TEXT,
  competences TEXT,
  ville VARCHAR(100),
  disponibilite VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS offres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  duree VARCHAR(100),
  periode VARCHAR(100),
  conditions TEXT,
  ville VARCHAR(100),
  id_offreur INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FO
