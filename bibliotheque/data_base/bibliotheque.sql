-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 14 nov. 2025 à 18:38
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `bibliotheque`
--

-- --------------------------------------------------------

--
-- Structure de la table `lecteurs`
--

CREATE TABLE `lecteurs` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `date_inscription` datetime DEFAULT current_timestamp(),
  `reset_token` varchar(64) DEFAULT NULL,
  `reset_expires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `lecteurs`
--

INSERT INTO `lecteurs` (`id`, `nom`, `prenom`, `email`, `password`, `date_inscription`, `reset_token`, `reset_expires`) VALUES
(1, 'Ndecky', 'Charles Guenole', 'cndecky4@gmail.com', '$2y$10$NXonTCpQ.vHzekKmM.n6ZeourCj44z9Wq.x5eSDNLeQGAfW5cL0rC', '2025-11-11 22:30:38', '6c0147e7c8c1eb85003ff9878886fed663e2c607529801809274a42f1a032257', '2025-11-12 02:18:11');

-- --------------------------------------------------------

--
-- Structure de la table `liste_lecture`
--

CREATE TABLE `liste_lecture` (
  `id` int(11) NOT NULL,
  `id_livre` int(11) DEFAULT NULL,
  `id_lecteur` int(11) DEFAULT NULL,
  `date_emprunt` date DEFAULT curdate(),
  `date_retour` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `liste_lecture`
--

INSERT INTO `liste_lecture` (`id`, `id_livre`, `id_lecteur`, `date_emprunt`, `date_retour`) VALUES
(4, 7, 1, '2025-11-12', NULL),
(7, 11, 1, '2025-11-13', NULL),
(8, 29, 1, '2025-11-14', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `livres`
--

CREATE TABLE `livres` (
  `id` int(11) NOT NULL,
  `titre` varchar(100) NOT NULL,
  `auteur` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `maison_edition` varchar(100) DEFAULT NULL,
  `nombre_exemplaire` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `livres`
--

INSERT INTO `livres` (`id`, `titre`, `auteur`, `description`, `maison_edition`, `nombre_exemplaire`) VALUES
(6, 'L’Enfant noir', 'Camara Laye', 'Roman autobiographique emblématique de la Guinée.', 'Présence Africaine', 5),
(7, 'Une si longue lettre', 'Mariama Bâ', 'Lettre poignante sur la condition des femmes au Sénégal.', 'NEAS', 5),
(8, 'Les Soleils des indépendances', 'Ahmadou Kourouma', 'Fable politique sur l’Afrique post-coloniale.', 'Seuil', 5),
(9, 'Allah n’est pas obligé', 'Ahmadou Kourouma', 'Enfance et guerre civile vues par un enfant-soldat.', 'Seuil', 4),
(10, 'Le Vieux Nègre et la médaille', 'Ferdinand Oyono', 'Critique profonde de l’administration coloniale.', 'Présence Africaine', 5),
(11, 'Une vie de boy', 'Ferdinand Oyono', 'Histoire d’un jeune domestique sous le colonat.', 'Présence Africaine', 3),
(12, 'L’Aventure ambiguë', 'Cheikh Hamidou Kane', 'Conflit entre culture africaine et éducation occidentale.', 'Julliard', 7),
(13, 'Le Pauvre Christ de Bomba', 'Mongo Beti', 'Critique du missionnariat chrétien au Cameroun.', 'Présence Africaine', 5),
(14, 'Mission terminée', 'Mongo Beti', 'Roman satirique sur l’hypocrisie sociale.', 'Présence Africaine', 4),
(15, 'Le Baobab fou', 'Ken Bugul', 'Autobiographie bouleversante d’une femme africaine.', 'NEAS', 5),
(16, 'Les bouts de bois de Dieu', 'Sembène Ousmane', 'Roman social sur la grève des cheminots de 1947.', 'Présence Africaine', 6),
(17, 'Xala', 'Sembène Ousmane', 'Critique de la bourgeoisie africaine post-coloniale.', 'Présence Africaine', 5),
(18, 'La Plaie', 'Malick Fall', 'Réflexion sur la société sénégalaise.', 'NEAS', 3),
(19, 'L’empire du mensonge', 'Tierno Monénembo', 'Dénonciation poétique des dictatures africaines.', 'Seuil', 4),
(20, 'Le Cercle des Tropiques', 'Alioum Fantouré', 'Roman historique guinéen.', 'Présence Africaine', 3),
(21, 'La Civilisation, ma mère!', 'Driss Chraïbi', 'Portrait drôle et critique du Maroc colonial.', 'Seuil', 5),
(22, 'Les Chiens du pouvoir', 'Henri Lopes', 'Vision ironique de la politique congolaise.', 'Présence Africaine', 4),
(23, 'Tribaliques', 'M. Mudimbe', 'Nouvelles puissantes sur la culture congolaise.', 'Présence Africaine', 3),
(24, 'L’amour, la fantasia', 'Assia Djebar', 'Roman historique algérien.', 'Actes Sud', 5),
(25, 'Nedjma', 'Kateb Yacine', 'Chef-d’œuvre poétique de l’Algérie.', 'Seuil', 4),
(26, 'Saisons d\'Afrique', 'Boubacar Boris Diop', 'Textes engagés du Sénégal.', 'Gallimard', 4),
(27, 'Murambi, le livre des ossements', 'Boubacar Boris Diop', 'Roman puissant sur le génocide rwandais.', 'Stock', 4),
(28, 'Les Veilleurs de Sangomar', 'Fatou Diome', 'Inspiré des légendes du Sénégal.', 'Flammarion', 4),
(29, 'Le ventre de l’Atlantique', 'Fatou Diome', 'Réflexion sur l’immigration et les rêves européens.', 'Anne Carrière', 5),
(30, 'So Long a Letter (anglais)', 'Mariama Bâ', 'Version anglaise du roman sénégalais culte.', 'Heinemann', 4),
(31, 'Le monde s’effondre', 'Chinua Achebe', 'Chef-d’œuvre sur le choc colonial au Nigeria.', 'Présence Africaine', 7),
(32, 'Things Fall Apart', 'Chinua Achebe', 'L’un des romans africains les plus lus au monde.', 'Heinemann', 8),
(33, 'No Longer at Ease', 'Chinua Achebe', 'Suite du Monde s’effondre.', 'Heinemann', 6),
(34, 'Half of a Yellow Sun', 'Chimamanda Ngozi Adichie', 'Roman sur la guerre du Biafra.', 'Fourth Estate', 5),
(35, 'Americanah', 'Chimamanda Ngozi Adichie', 'Identité, amour et migration.', 'Fourth Estate', 7),
(36, 'Purple Hibiscus', 'Chimamanda Ngozi Adichie', 'Roman familial et religieux.', 'Algonquin Books', 5),
(37, 'Aké', 'Wole Soyinka', 'Mémoires du prix Nobel nigérian.', 'Vintage', 5),
(38, 'Death and the King’s Horseman', 'Wole Soyinka', 'Tragédie nigériane remarquable.', 'Methuen', 4),
(39, 'The Famished Road', 'Ben Okri', 'Roman mystique primé Booker Prize.', 'Jonathan Cape', 5),
(40, 'The Secret Lives of Baba Segi\'s Wives', 'Lola Shoneyin', 'Polygamie et satire sociale au Nigeria.', 'Serpent’s Tail', 5),
(41, 'Kocoumbo, l’étudiant noir', 'Bernard Dadié', 'Odyssée satirique d’un étudiant ivoirien.', 'Hatier', 6),
(42, 'Climbié', 'Bernard Dadié', 'Autobiographie inspirante.', 'Présence Africaine', 4),
(43, 'Soundjata ou l’épopée mandingue', 'D.T. Niane', 'Mythe fondateur de l’Afrique de l’Ouest.', 'Présence Africaine', 6),
(44, 'Les Trois Volontés de Malika', 'Ibrahima Ly', 'Réflexion sur la société mauritanienne.', 'NEAS', 4),
(45, 'Les petits garçons naissent aussi des étoiles', 'Emmanuel Dongala', 'Roman d’Afrique centrale.', 'Le Serpent à Plumes', 3),
(46, 'Weep Not, Child', 'Ngũgĩ wa Thiong\'o', 'Roman kenyan sur la lutte pour l’indépendance.', 'Heinemann', 5),
(47, 'A Grain of Wheat', 'Ngũgĩ wa Thiong\'o', 'Révolution Mau Mau au Kenya.', 'Heinemann', 4),
(48, 'Petals of Blood', 'Ngũgĩ wa Thiong\'o', 'Critique sociale post-indépendance.', 'Heinemann', 3),
(49, 'Nervous Conditions', 'Tsitsi Dangarembga', 'Roman zimbabwéen féminin puissant.', 'Heinemann', 6),
(50, 'The Book of Not', 'Tsitsi Dangarembga', 'Suite du classique Nervous Conditions.', 'Ayebia', 4),
(51, 'L’Étranger', 'Albert Camus', 'Classique algérien-philosophique mondial.', 'Gallimard', 9),
(52, 'La Peste', 'Albert Camus', 'Roman écrit à Oran.', 'Gallimard', 8),
(53, 'Le Passé simple', 'Driss Chraïbi', 'Révolte d’un jeune marocain.', 'Denoël', 4),
(54, 'Le Pain nu', 'Mohamed Choukri', 'Autobiographie marocaine choc.', 'Maspero', 5),
(55, 'Naitre deux fois', 'Amara Lakhous', 'Roman algérien contemporain.', 'Actes Sud', 3),
(56, 'Peau noire, masques blancs', 'Frantz Fanon', 'Analyse de l’aliénation coloniale.', 'Seuil', 7),
(57, 'Les Damnés de la terre', 'Frantz Fanon', 'Essai révolutionnaire.', 'Maspero', 6),
(58, 'L’Afrique dans le monde', 'Cheikh Anta Diop', 'Œuvre majeure de l’histoire africaine.', 'Présence Africaine', 8),
(59, 'Nations nègres et culture', 'Cheikh Anta Diop', 'Analyse profonde des civilisations africaines.', 'Présence Africaine', 9),
(60, 'Civilisation ou Barbarie', 'Cheikh Anta Diop', 'Travail fondateur sur l’histoire africaine.', 'Présence Africaine', 8),
(61, 'Contes d’Amadou Koumba', 'Birago Diop', 'Recueil mythique du Sénégal.', 'Présence Africaine', 7),
(62, 'Le Roi Moogli africain', 'Issa Samb', 'Conte moderne.', 'NEAS', 4),
(63, 'Les Contes du Sahel', 'Hampaté Bâ', 'Tradition orale africaine.', 'Actes Sud', 5),
(64, 'L’Étrange Destin de Wangrin', 'Amadou Hampâté Bâ', 'Chef-d’œuvre du Mali.', 'Actes Sud', 8),
(65, 'Les impatientes', 'Djaïli Amadou Amal', 'Roman sur les violences faites aux femmes.', 'Emmanuelle Collas', 7),
(66, 'Munyal', 'Djaïli Amadou Amal', 'Version originale camerounaise.', 'Proximité', 5),
(67, 'Terre ceinte', 'Mohamed Mbougar Sarr', 'Roman engagé au Sahel.', 'Présence Africaine', 6),
(68, 'La plus secrète mémoire des hommes', 'Mohamed Mbougar Sarr', 'Prix Goncourt 2021.', 'Philippe Rey', 9),
(69, 'Silence du chœur', 'Mohamed Mbougar Sarr', 'Migration et humanité.', 'Présence Africaine', 6),
(70, 'De purs hommes', 'Mohamed Mbougar Sarr', 'Roman puissant sur l’homophobie.', 'Philippe Rey', 5),
(71, '100 jours', 'Scholastique Mukasonga', 'Rwanda, douleur et mémoire.', 'Gallimard', 5),
(72, 'Notre-Dame du Nil', 'Scholastique Mukasonga', 'Roman pré-génocide du Rwanda.', 'Gallimard', 6),
(73, 'La colère et l’oubli', 'Scholastique Mukasonga', 'Mémoire et survie.', 'Gallimard', 4),
(74, 'Mathématiques africaines modernes', 'Mamadou Seck', 'Introduction clair à la logique mathématique.', 'NEAS', 5),
(75, 'La Physique du Sahel', 'Bocar Yattara', 'Physique appliquée au continent.', 'Presses Africaines', 4),
(76, 'Chimie générale africaine', 'B. Oumar Traoré', 'Ouvrage universitaire.', 'NEAS', 5),
(77, 'Biologie tropicale moderne', 'O. K. Kouassi', 'Ouvrage réputé en Afrique de l’Ouest.', 'Afrique Science', 4),
(78, 'La Nuit', 'Mohammed Dib', 'Roman algérien colonial.', 'Seuil', 4),
(79, 'Qui a tué Palomino Molero ?', 'Mario Vargas Llosa', 'Très lu en Afrique francophone.', 'Gallimard', 5),
(80, 'Chroniques Abidjanaises', 'Venance Konan', 'Recueil satirique ivoirien.', 'FratMat', 4);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `lecteurs`
--
ALTER TABLE `lecteurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `liste_lecture`
--
ALTER TABLE `liste_lecture`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_livre` (`id_livre`),
  ADD KEY `id_lecteur` (`id_lecteur`);

--
-- Index pour la table `livres`
--
ALTER TABLE `livres`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `lecteurs`
--
ALTER TABLE `lecteurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `liste_lecture`
--
ALTER TABLE `liste_lecture`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `livres`
--
ALTER TABLE `livres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `liste_lecture`
--
ALTER TABLE `liste_lecture`
  ADD CONSTRAINT `liste_lecture_ibfk_1` FOREIGN KEY (`id_livre`) REFERENCES `livres` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `liste_lecture_ibfk_2` FOREIGN KEY (`id_lecteur`) REFERENCES `lecteurs` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
