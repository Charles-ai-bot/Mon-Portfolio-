// scriptportfolio.js - Adapté pour le template Massively
// Charles Ndecky - Portfolio

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init({
            publicKey: "qcxItu3w1-_5P5AWp",
            blockHeadless: true,
        });
    }

    // 1. Année actuelle dans le footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // 2. Navigation active au défilement (adapté pour Massively)
    const navLinks = document.querySelectorAll('#nav .links a');
    const sections = document.querySelectorAll('section, #main > article');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === '#' + current || 
                (current === '' && href === '#home') ||
                (href === 'index.html' && current === '')) {
                link.classList.add('active');
            }
        });
    });

    // 3. Bouton "Retour en haut" (ajouté manuellement dans HTML)
    const backToTopButton = document.createElement('button');
    backToTopButton.id = 'back-to-top';
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    backToTopButton.addEventListener('mouseenter', function() {
        this.style.background = '#2980b9';
        this.style.transform = 'scale(1.1)';
    });
    
    backToTopButton.addEventListener('mouseleave', function() {
        this.style.background = '#3498db';
        this.style.transform = 'scale(1)';
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    document.body.appendChild(backToTopButton);
    
    window.addEventListener('scroll', function() {
        backToTopButton.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });

    // 4. Animation des barres de compétences
    const competencesSection = document.getElementById('competences');
    if (competencesSection) {
        const skillBars = document.querySelectorAll('.skill-bar .skill-level');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && skillBars.length > 0) {
                    skillBars.forEach(bar => {
                        const width = bar.style.width;
                        bar.style.width = '0';
                        setTimeout(() => {
                            bar.style.transition = 'width 1.5s ease-in-out';
                            bar.style.width = width;
                        }, 300);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(competencesSection);
    }

    // 5. FORMULAIRE DE CONTACT AVEC EMAILJS (pour le footer)
    const contactForm = document.querySelector('#footer form');
    if (contactForm) {
        // Créer un élément pour les messages
        const formMessage = document.createElement('div');
        formMessage.className = 'form-message';
        formMessage.style.cssText = `
            margin-top: 15px;
            padding: 10px;
            border-radius: 4px;
            display: none;
            text-align: center;
        `;
        contactForm.appendChild(formMessage);
        
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Vérifier les champs requis
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#e74c3c';
                } else {
                    field.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                showMessage(formMessage, '❌ Veuillez remplir tous les champs obligatoires.', 'error');
                return;
            }
            
            // Préparer les données
            const formData = {
                name: this.querySelector('[name="name"]')?.value || '',
                email: this.querySelector('[name="email"]')?.value || '',
                message: this.querySelector('[name="message"]')?.value || '',
                subject: 'Message depuis le portfolio'
            };
            
            // Afficher le chargement
            const submitBtn = this.querySelector('input[type="submit"]');
            const originalText = submitBtn.value;
            submitBtn.value = 'Envoi en cours...';
            submitBtn.disabled = true;
            
            try {
                // Envoi avec EmailJS
                const response = await emailjs.send(
                    'service_9spps3b',
                    'template_u7demj2',
                    {
                        name: formData.name,
                        email: formData.email,
                        message: formData.message,
                        subject: formData.subject
                    }
                );
                
                if (response.status === 200) {
                    showMessage(formMessage, `
                        <div style="text-align: center;">
                            <i class="fas fa-check-circle" style="color: #2ecc71; font-size: 1.5rem;"></i>
                            <p style="margin: 5px 0; color: #2ecc71;">Message envoyé avec succès !</p>
                            <p style="font-size: 0.9rem; color: #7f8c8d;">Je vous répondrai dans les plus brefs délais.</p>
                        </div>
                    `, 'success');
                    
                    // Réinitialiser le formulaire
                    this.reset();
                }
                
            } catch (error) {
                console.error('Erreur EmailJS:', error);
                showMessage(formMessage, `
                    <div style="text-align: center;">
                        <i class="fas fa-exclamation-circle" style="color: #e74c3c; font-size: 1.5rem;"></i>
                        <p style="margin: 5px 0; color: #e74c3c;">Erreur d'envoi</p>
                        <p style="font-size: 0.9rem; color: #7f8c8d;">
                            Contactez-moi directement à :<br>
                            <strong>cndecky4@gmail.com</strong>
                        </p>
                    </div>
                `, 'error');
                
            } finally {
                // Réinitialiser le bouton
                submitBtn.value = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // 6. Animation des cartes de projet (si elles existent)
    document.querySelectorAll('.post').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });

    // 7. Animation progressive de la page
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // 8. Gestion des liens externes (ouverture dans un nouvel onglet)
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.href.includes(window.location.hostname)) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

    // Fonction utilitaire pour afficher des messages
    function showMessage(element, content, type) {
        if (!element) return;
        
        element.innerHTML = content;
        element.style.display = 'block';
        element.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
        element.style.color = type === 'success' ? '#155724' : '#721c24';
        element.style.border = type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb';
        
        // Défilement vers le message
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Cacher après 5 secondes pour les succès
        if (type === 'success') {
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }
    }
});

// Fonction de validation d'email (utilitaire)
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}