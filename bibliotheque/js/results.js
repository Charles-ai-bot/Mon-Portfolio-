document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    
    if (query) {
        document.getElementById('searchQuery').value = query;
        performSearch(query);
    }

    // Gestion du formulaire de recherche
    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newQuery = document.getElementById('searchQuery').value;
        if (newQuery.trim()) {
            window.location.href = `results.html?query=${encodeURIComponent(newQuery)}`;
        }
    });
});

async function performSearch(query) {
    try {
        const response = await fetch(`php/search.php?query=${encodeURIComponent(query)}`);
        const books = await response.json();
        
        displayResults(books, query);
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        document.getElementById('search-results').innerHTML = `
            <div class="error-message">
                <p>Une erreur est survenue lors de la recherche. Veuillez réessayer.</p>
            </div>
        `;
    }
}

function displayResults(books, query) {
    const resultsSection = document.getElementById('search-results');
    
    if (books.length === 0) {
        resultsSection.innerHTML = `
            <div class="no-results">
                <h3>Aucun résultat trouvé pour "${query}"</h3>
                <p>Essayez avec d'autres termes de recherche.</p>
            </div>
        `;
        return;
    }
    
    resultsSection.innerHTML = `
        <h3>Résultats pour "${query}" (${books.length} livre(s) trouvé(s))</h3>
        <div class="books-grid">
            ${books.map(book => `
                <div class="book-card">
                    <div class="book-title">${book.titre}</div>
                    <div class="book-author">${book.auteur}</div>
                    <div class="book-description">${book.description ? book.description.substring(0, 100) + '...' : 'Aucune description disponible'}</div>
                    <div class="book-actions">
                        <a href="details.html?id=${book.id}" class="btn btn-primary">Voir détails</a>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}