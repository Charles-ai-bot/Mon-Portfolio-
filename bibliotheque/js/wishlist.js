document.addEventListener('DOMContentLoaded', function() {
    loadWishlist();
});

async function loadWishlist() {
    const user = getCurrentUser();
    if (!user) return;
    
    try {
        const response = await fetch(`php/get_wishlist.php?lecteur_id=${user.id}`);
        const wishlist = await response.json();
        
        displayWishlist(wishlist);
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('wishlist-content').innerHTML = `
            <div class="error-message">
                <p>Erreur lors du chargement de votre liste.</p>
            </div>
        `;
    }
}

function displayWishlist(wishlist) {
    const wishlistContent = document.getElementById('wishlist-content');
    
    if (wishlist.length === 0) {
        wishlistContent.innerHTML = `
            <div class="empty-wishlist">
                <h3>Votre liste de lecture est vide</h3>
                <p>Ajoutez des livres depuis la page de détails !</p>
                <a href="index.html" class="btn btn-primary">Découvrir des livres</a>
            </div>
        `;
        return;
    }
    
    wishlistContent.innerHTML = `
        <div class="books-grid">
            ${wishlist.map(item => `
                <div class="book-card">
                    <div class="book-title">${item.titre}</div>
                    <div class="book-author">${item.auteur}</div>
                    <div class="wishlist-info">
                        <p><strong>Date d'emprunt:</strong> ${item.date_emprunt}</p>
                        ${item.date_retour ? `<p><strong>Date de retour:</strong> ${item.date_retour}</p>` : ''}
                    </div>
                    <div class="book-actions">
                        <a href="details.html?id=${item.id_livre}" class="btn btn-primary">Voir détails</a>
                        <button onclick="removeFromWishlist(${item.id})" class="btn btn-danger">Retirer</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

async function removeFromWishlist(wishlistItemId) {
    if (confirm('Êtes-vous sûr de vouloir retirer ce livre de votre liste ?')) {
        try {
            const response = await fetch('php/remove_from_wishlist.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: wishlistItemId
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Livre retiré de votre liste !');
                loadWishlist(); // Recharger la liste
            } else {
                alert('Erreur: ' + result.message);
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors du retrait de la liste');
        }
    }
}