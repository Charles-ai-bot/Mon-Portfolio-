<?php
header('Content-Type: application/json');
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['nom']) || !isset($data['prenom']) || !isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Tous les champs sont requis']);
    exit;
}

try {
    // Vérifier si l'email existe déjà
    $stmt = $pdo->prepare("SELECT id FROM Lecteurs WHERE email = ?");
    $stmt->execute([$data['email']]);
    
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Cet email est déjà utilisé']);
        exit;
    }
    
    // Hasher le mot de passe
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
    
    // Insérer le nouveau lecteur
    $stmt = $pdo->prepare("INSERT INTO Lecteurs (nom, prenom, email, password) VALUES (?, ?, ?, ?)");
    $stmt->execute([$data['nom'], $data['prenom'], $data['email'], $hashedPassword]);
    
    echo json_encode(['success' => true, 'message' => 'Inscription réussie']);
} catch (PDOException $e) {
    error_log("Erreur d'inscription: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Erreur de base de données: ' . $e->getMessage()]);
}
?>