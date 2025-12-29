<?php
header('Content-Type: application/json');
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Lire un livre ou tous les livres
        $id = $_GET['id'] ?? '';
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM Livres WHERE id = ?");
            $stmt->execute([$id]);
            $book = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($book ?: ['error' => 'Livre non trouvé']);
        } else {
            $stmt = $pdo->query("SELECT * FROM Livres ORDER BY id DESC");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
        break;
        
    case 'POST':
        // Créer un livre
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("INSERT INTO Livres (titre, auteur, description, maison_edition, nombre_exemplaire) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['titre'],
            $data['auteur'],
            $data['description'],
            $data['maison_edition'],
            $data['nombre_exemplaire']
        ]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        break;
        
    case 'PUT':
        // Mettre à jour un livre
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("UPDATE Livres SET titre=?, auteur=?, description=?, maison_edition=?, nombre_exemplaire=? WHERE id=?");
        $stmt->execute([
            $data['titre'],
            $data['auteur'],
            $data['description'],
            $data['maison_edition'],
            $data['nombre_exemplaire'],
            $data['id']
        ]);
        echo json_encode(['success' => true]);
        break;
        
    case 'DELETE':
        // Supprimer un livre
        $id = $_GET['id'] ?? '';
        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM Livres WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => $stmt->rowCount() > 0]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
}
?>