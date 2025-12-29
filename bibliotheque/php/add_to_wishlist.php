<?php
header('Content-Type: application/json');
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id_livre']) || !isset($data['id_lecteur'])) {
    echo json_encode(['success' => false, 'message' => 'Données manquantes']);
    exit;
}

$id_livre = $data['id_livre'];
$id_lecteur = $data['id_lecteur'];

try {
    // Vérifier si le livre existe
    $stmt = $pdo->prepare("SELECT id, nombre_exemplaire FROM Livres WHERE id = ?");
    $stmt->execute([$id_livre]);
    $livre = $stmt->fetch();
    
    if (!$livre) {
        echo json_encode(['success' => false, 'message' => 'Livre non trouvé']);
        exit;
    }
    
    // Vérifier s'il reste des exemplaires
    if ($livre['nombre_exemplaire'] <= 0) {
        echo json_encode(['success' => false, 'message' => 'Aucun exemplaire disponible']);
        exit;
    }
    
    // Vérifier si le livre n'est pas déjà dans la liste
    $stmt = $pdo->prepare("SELECT id FROM Liste_Lecture WHERE id_livre = ? AND id_lecteur = ? AND date_retour IS NULL");
    $stmt->execute([$id_livre, $id_lecteur]);
    
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Livre déjà dans votre liste']);
        exit;
    }
    
    // Ajouter à la liste et diminuer le nombre d'exemplaires
    $pdo->beginTransaction();
    
    $stmt = $pdo->prepare("INSERT INTO Liste_Lecture (id_livre, id_lecteur, date_emprunt) VALUES (?, ?, CURDATE())");
    $stmt->execute([$id_livre, $id_lecteur]);
    
    $stmt = $pdo->prepare("UPDATE Livres SET nombre_exemplaire = nombre_exemplaire - 1 WHERE id = ?");
    $stmt->execute([$id_livre]);
    
    $pdo->commit();
    
    echo json_encode(['success' => true, 'message' => 'Livre ajouté à votre liste de lecture']);
    
} catch (PDOException $e) {
    $pdo->rollBack();
    error_log("Erreur add_to_wishlist: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Erreur de base de données: ' . $e->getMessage()]);
}
?>