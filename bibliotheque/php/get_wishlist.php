<?php
header('Content-Type: application/json');
require_once 'config.php';

$lecteurId = $_GET['lecteur_id'] ?? '';

if (empty($lecteurId)) {
    echo json_encode([]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT ll.*, l.titre, l.auteur 
        FROM Liste_Lecture ll 
        JOIN Livres l ON ll.id_livre = l.id 
        WHERE ll.id_lecteur = ? 
        ORDER BY ll.date_emprunt DESC
    ");
    $stmt->execute([$lecteurId]);
    $wishlist = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($wishlist);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de base de données']);
}
?>