document.addEventListener('DOMContentLoaded', function() {
    loadBooks();
    
    const bookForm = document.getElementById('bookFormElement');
    bookForm.addEventListener('submit', handleBookSubmit);
});

async function loadBooks() {
    try {
        const response = await fetch('php/get_books.php');
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('booksList').innerHTML = '<p>Erreur lors du chargement des livres</p>';
    }
}

function displayBooks(books) {
    const booksList = document.getElementById('booksList');
    
    booksList.innerHTML = `
        <div class="books-grid">
            ${books.map(book => `
                <div class="book-card admin-book-card">
                    <div class="book-title">${book.titre}</div>
                    <div class="book-author">${book.auteur}</div>
                    <div class="book-info">
                        <p><strong>Édition:</strong> ${book.maison_edition || 'Non spécifiée'}</p>
                        <p><strong>Exemplaires:</strong> ${book.nombre_exemplaire}</p>
                    </div>
                    <div class="book-description">
                        ${book.description ? book.description.substring(0, 100) + '...' : 'Aucune description'}
                    </div>
                    <div class="book-actions">
                        <button onclick="editBook(${book.id})" class="btn btn-primary">Modifier</button>
                        <button onclick="deleteBook(${book.id})" class="btn btn-danger">Supprimer</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function showAddBookForm() {
    document.getElementById('formTitle').textContent = 'Ajouter un livre';
    document.getElementById('bookFormElement').reset();
    document.getElementById('bookId').value = '';
    document.getElementById('bookForm').style.display = 'block';
}

function hideBookForm() {
    document.getElementById('bookForm').style.display = 'none';
}

async function editBook(bookId) {
    try {
        const response = await fetch(`php/get_book_details.php?id=${bookId}`);
        const book = await response.json();
        
        document.getElementById('formTitle').textContent = 'Modifier le livre';
        document.getElementById('bookId').value = book.id;
        document.getElementById('titre').value = book.titre;
        document.getElementById('auteur').value = book.auteur;
        document.getElementById('description').value = book.description || '';
        document.getElementById('maison_edition').value = book.maison_edition || '';
        document.getElementById('nombre_exemplaire').value = book.nombre_exemplaire;
        
        document.getElementById('bookForm').style.display = 'block';
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du chargement du livre');
    }
}

async function handleBookSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
        const url = 'php/crud_books.php';
        const method = data.id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(data.id ? 'Livre modifié avec succès' : 'Livre ajouté avec succès');
            hideBookForm();
            loadBooks();
        } else {
            alert('Erreur: ' + result.message);
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'enregistrement');
    }
}

async function deleteBook(bookId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
        try {
            const response = await fetch(`php/crud_books.php?id=${bookId}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Livre supprimé avec succès');
                loadBooks();
            } else {
                alert('Erreur: ' + result.message);
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la suppression');
        }
    }
}