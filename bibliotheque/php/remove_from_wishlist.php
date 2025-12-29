<?php
header('Content-Type: application/json');
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID manquant']);
    exit;
}

try {
    // Récupérer l'ID du livre avant suppression
    $stmt = $pdo->prepare("SELECT id_livre FROM Liste_Lecture WHERE id = ?");
    $stmt->execute([$data['id']]);
    $wishlistItem = $stmt->fetch();
    
    if (!$wishlistItem) {
        echo json_encode(['success' => false, 'message' => 'Élément non trouvé']);
        exit;
    }
    
    $pdo->beginTransaction();
    
    // Supprimer de la liste
    $stmt = $pdo->prepare("DELETE FROM Liste_Lecture WHERE id = ?");
    $stmt->execute([$data['id']]);
    
    // Augmenter le nombre d'exemplaires
    $stmt = $pdo->prepare("UPDATE Livres SET nombre_exemplaire = nombre_exemplaire + 1 WHERE id = ?");
    $stmt->execute([$wishlistItem['id_livre']]);
    
    $pdo->commit();
    
    echo json_encode(['success' => true, 'message' => 'Livre retiré de la liste']);
    
} catch (PDOException $e) {
    $pdo->rollBack();
    error_log("Erreur remove_from_wishlist: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Erreur de base de données']);
}
?>