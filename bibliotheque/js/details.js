document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    
    if (bookId) {
        loadBookDetails(bookId);
    } else {
        showError('Livre non trouvé.');
    }
});

async function loadBookDetails(bookId) {
    try {
        const response = await fetch(`php/get_book_details.php?id=${bookId}`);
        const book = await response.json();
        
        if (book.error) {
            throw new Error(book.error);
        }
        
        displayBookDetails(book);
    } catch (error) {
        console.error('Erreur:', error);
        showError('Erreur lors du chargement des détails: ' + error.message);
    }
}

function displayBookDetails(book) {
    const detailsSection = document.getElementById('book-details');
    const user = getCurrentUser();
    
    detailsSection.innerHTML = `
        <div class="book-details">
            <h2>${book.titre}</h2>
            <div class="detail-item">
                <span class="detail-label">Auteur:</span>
                <span>${book.auteur}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Maison d'édition:</span>
                <span>${book.maison_edition || 'Non spécifiée'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Exemplaires disponibles:</span>
                <span>${book.nombre_exemplaire}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Description:</span>
                <p>${book.description || 'Aucune description disponible.'}</p>
            </div>
            <div class="book-actions">
                ${user ? 
                    `<button onclick="addToWishlist(${book.id})" class="btn btn-primary">Ajouter à ma liste</button>` :
                    `<button onclick="showLoginRequired()" class="btn btn-primary">Ajouter à ma liste</button>`
                }
                <a href="index.html" class="btn btn-secondary">← Retour à l'accueil</a>
            </div>
        </div>
    `;
}

function showLoginRequired() {
    document.getElementById('loginRequired').style.display = 'block';
}

async function addToWishlist(bookId) {
    const user = requireAuth();
    if (!user) return;
    
    try {
        const response = await fetch('php/add_to_wishlist.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_livre: bookId,
                id_lecteur: user.id
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Livre ajouté à votre liste de lecture !');
            // Recharger les détails pour mettre à jour le nombre d'exemplaires
            loadBookDetails(bookId);
        } else {
            alert('Erreur: ' + result.message);
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'ajout à la liste');
    }
}

function showError(message) {
    document.getElementById('book-details').innerHTML = `
        <div class="error-message">
            <p>${message}</p>
            <a href="index.html" class="btn btn-primary">Retour à l'accueil</a>
        </div>
    `;
}