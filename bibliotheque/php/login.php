<?php
header('Content-Type: application/json');
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Email et mot de passe requis']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, nom, prenom, email, password FROM Lecteurs WHERE email = ?");
    $stmt->execute([$data['email']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user && password_verify($data['password'], $user['password'])) {
        // Retirer le mot de passe de la réponse
        unset($user['password']);
        echo json_encode([
            'success' => true, 
            'message' => 'Connexion réussie',
            'user' => $user
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Email ou mot de passe incorrect']);
    }
} catch (PDOException $e) {
    error_log("Erreur de connexion: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Erreur de base de données']);
}
?>