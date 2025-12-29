<?php
header('Content-Type: application/json');
require_once 'config.php';

$limit = $_GET['limit'] ?? 10;

try {
    $stmt = $pdo->prepare("SELECT * FROM Livres ORDER BY id DESC LIMIT ?");
    $stmt->bindValue(1, (int)$limit, PDO::PARAM_INT);
    $stmt->execute();
    $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($books);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de base de données']);
}
?>