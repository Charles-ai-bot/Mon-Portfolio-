// Gestion de l'interface utilisateur pour l'authentification
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
    checkPageAccess();
});

// Mettre à jour la navigation en fonction du statut de connexion
function updateNavigation() {
    const user = getCurrentUser();
    const navMenu = document.getElementById('navMenu');
    
    if (!navMenu) return;
    
    if (user) {
        // Utilisateur connecté
        navMenu.innerHTML = `
            <li><a href="index.html">Accueil</a></li>
            <li><a href="wishlist.html">Ma Liste</a></li>
            <li><a href="admin.html">Administration</a></li>
            <li>
                <div class="user-menu">
                    <span class="user-info">Bonjour, ${user.prenom}</span>
                    <button onclick="logout()" class="logout-btn">Déconnexion</button>
                </div>
            </li>
        `;
    } else {
        // Utilisateur non connecté
        navMenu.innerHTML = `
            <li><a href="index.html">Accueil</a></li>
            <li><a href="login.html" class="btn-login">Connexion</a></li>
            <li><a href="register.html" class="btn-register">Inscription</a></li>
        `;
    }
}

// Obtenir l'utilisateur actuel
function getCurrentUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
}

// Vérifier l'accès aux pages
function checkPageAccess() {
    const user = getCurrentUser();
    const protectedPages = ['wishlist.html', 'admin.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !user) {
        alert('Veuillez vous connecter pour accéder à cette page.');
        window.location.href = 'login.html';
        return;
    }
}

// Déconnexion
function logout() {
    localStorage.removeItem('user');
    updateNavigation();
    window.location.href = 'index.html';
}

// Vérifier si l'utilisateur est connecté pour les actions
function requireAuth() {
    const user = getCurrentUser();
    if (!user) {
        if (confirm('Vous devez être connecté pour cette action. Voulez-vous vous connecter ?')) {
            window.location.href = 'login.html';
        }
        return null;
    }
    return user;
}