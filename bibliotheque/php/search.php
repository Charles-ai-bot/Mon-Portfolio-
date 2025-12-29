<?php
header('Content-Type: application/json');
require_once 'config.php';

$query = $_GET['query'] ?? '';

if (empty($query)) {
    echo json_encode([]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT * FROM Livres 
        WHERE titre LIKE ? OR auteur LIKE ?
        ORDER BY titre
    ");
    
    $searchTerm = "%$query%";
    $stmt->execute([$searchTerm, $searchTerm]);
    $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($books);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de base de données']);
}
?>