<?php
header('Content-Type: application/json');
require_once 'config.php';

$bookId = $_GET['id'] ?? '';

if (empty($bookId)) {
    http_response_code(400);
    echo json_encode(['error' => 'ID du livre manquant']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM Livres WHERE id = ?");
    $stmt->execute([$bookId]);
    $book = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$book) {
        http_response_code(404);
        echo json_encode(['error' => 'Livre non trouvé']);
        exit;
    }
    
    echo json_encode($book);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de base de données']);
}
?>