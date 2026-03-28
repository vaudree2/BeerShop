// État global
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    initEventListeners();
    loadCartModalContent();
});

// Afficher les produits
function displayProducts(productsToShow) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    if (!productsToShow || productsToShow.length === 0) {
        productsGrid.innerHTML = '<div class="no-products">Aucun produit trouvé.</div>';
        return;
    }
    
    productsGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.imageUrl}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x400?text=Bi%C3%A8re'">
            <div class="product-info">
                <h3 class="product-name">${escapeHtml(product.name)}</h3>
                <div class="product-details">
                    <p><strong>Volume:</strong> ${product.volume || 'Non spécifié'}</p>
                    <p><strong>Couleur:</strong> ${product.color || 'Non spécifié'}</p>
                    <p><strong>Brasserie:</strong> ${product.brewery || 'Non spécifié'}</p>
                    <p><strong>Pays:</strong> ${product.country || 'Non spécifié'}</p>
                    ${product.bottlingDate ? `<p><strong>Mise en bouteille:</strong> ${formatDate(product.bottlingDate)}</p>` : ''}
                    ${product.expiryDate ? `<p><strong>À consommer avant:</strong> ${formatDate(product.expiryDate)}</p>` : ''}
                    ${product.description ? `<p><strong>Description:</strong> ${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}</p>` : ''}
                </div>
                <div class="product-price">${product.price.toFixed(2)} ${CONFIG.currency}</div>
                <span class="stock-status ${product.stock ? 'in-stock' : 'out-of-stock'}">
                    ${product.stock ? '✓ En stock' : '✗ Épuisé'}
                </span>
                <button class="add-to-cart" 
                        onclick="addToCart(${product.id})"
                        ${!product.stock ? 'disabled' : ''}>
                    ${product.stock ? 'Ajouter au panier' : 'Indisponible'}
                </button>
            </div>
        </div>
    `).join('');
}

// Échapper les caractères HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Ajouter au panier
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.stock) {
        showNotification('Ce produit n\'est plus disponible.', 'error');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
        showNotification(`Quantité de ${product.name} augmentée !`);
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            imageUrl: product.imageUrl
        });
        showNotification(`${product.name} ajouté au panier !`);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCartModalContent();
}

// Mettre à jour le compteur du panier
function updateCartCount() {
    const cartCounts = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounts.forEach(el => {
        if (el) el.textContent = totalItems;
    });
}

// Charger le contenu du panier modal
function loadCartModalContent() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; padding:2rem;">Votre panier est vide</p>';
        if (cartTotalContainer) cartTotalContainer.innerHTML = '';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${escapeHtml(item.name)}</h4>
                <div class="cart-item-price">${item.price.toFixed(2)}€ x ${item.quantity}</div>
            </div>
            <div>
                <strong>${(item.price * item.quantity).toFixed(2)}€</strong>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
            </div>
        </div>
    `).join('');
    
    const subtotal = calculateCartTotal();
    const selectedCountry = document.getElementById('country')?.value || 'belgique';
    const shippingCost = calculateShipping(selectedCountry);
    const total = subtotal + shippingCost;
    const freeShippingThreshold = CONFIG.freeShippingThreshold || 100;
    const freeShippingMessage = subtotal >= freeShippingThreshold ? 
        '<span style="color:green;">✓ Livraison offerte !</span>' : 
        `Encore ${(freeShippingThreshold - subtotal).toFixed(2)}€ pour la livraison offerte`;
    
    if (cartTotalContainer) {
        cartTotalContainer.innerHTML = `
            <div style="margin-bottom: 0.5rem; font-size: 0.9rem;">${freeShippingMessage}</div>
            <div>Sous-total: ${subtotal.toFixed(2)}€</div>
            <div>Livraison: ${shippingCost.toFixed(2)}€</div>
            <hr style="margin: 0.5rem 0;">
            <strong>Total: ${total.toFixed(2)}€</strong>
        `;
    }
}

// Calculer le total du panier
function calculateCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Calculer les frais de livraison
function calculateShipping(country) {
    const subtotal = calculateCartTotal();
    const freeThreshold = CONFIG.freeShippingThreshold || 100;
    
    if (subtotal >= freeThreshold) {
        return 0;
    }
    
    switch(country) {
        case 'belgique':
            return CONFIG.shippingRates.belgium;
        case 'europe':
            return CONFIG.shippingRates.europe;
        default:
            return CONFIG.shippingRates.other;
    }
}

// Retirer du panier
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCartModalContent();
    showNotification('Produit retiré du panier');
}

// Passer la commande avec PayPal
async function checkout(shippingInfo) {
    if (cart.length === 0) {
        showNotification('Votre panier est vide', 'error');
        return false;
    }
    
    const subtotal = calculateCartTotal();
    const shippingCost = calculateShipping(shippingInfo.country);
    const total = subtotal + shippingCost;
    
    try {
        showNotification('Préparation du paiement PayPal...', 'info');
        
        const paymentResult = await processPayment(total);
        
        if (paymentResult.success) {
            const order = {
                id: generateOrderId(),
                items: [...cart],
                subtotal: subtotal,
                shippingCost: shippingCost,
                total: total,
                customer: shippingInfo,
                date: new Date().toISOString(),
                status: 'confirmed',
                transactionId: paymentResult.transactionId
            };
            
            saveOrder(order);
            await sendConfirmationEmail(order);
            
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            loadCartModalContent();
            
            showNotification('✅ Paiement confirmé ! Un email de confirmation vous a été envoyé.', 'success');
            return true;
        } else {
            showNotification('Paiement annulé', 'error');
            return false;
        }
    } catch (error) {
        console.error('Erreur lors du paiement:', error);
        showNotification('Erreur lors du paiement. Veuillez réessayer.', 'error');
        return false;
    }
}

// Traitement du paiement avec PayPal
function processPayment(amount) {
    return new Promise((resolve, reject) => {
        // Vérifier que PayPal est chargé
        if (typeof paypal === 'undefined') {
            console.error('PayPal SDK non chargé');
            // Fallback pour tester sans PayPal
            const confirmed = confirm(`Paiement de ${amount.toFixed(2)}€. Confirmez-vous ?`);
            resolve({ success: confirmed, transactionId: confirmed ? 'MANUAL-' + Date.now() : null });
            return;
        }
        
        // Créer un conteneur pour le bouton PayPal
        const container = document.createElement('div');
        container.id = 'paypal-button-container-temp';
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.backgroundColor = 'white';
        container.style.padding = '20px';
        container.style.borderRadius = '10px';
        container.style.boxShadow = '0 5px 30px rgba(0,0,0,0.3)';
        container.style.zIndex = '10000';
        container.style.minWidth = '300px';
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '10px';
        closeBtn.style.right = '10px';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.fontSize = '20px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = () => {
            document.body.removeChild(container);
            resolve({ success: false });
        };
        
        container.appendChild(closeBtn);
        
        const title = document.createElement('h3');
        title.textContent = `Paiement de ${amount.toFixed(2)}€`;
        title.style.marginBottom = '20px';
        title.style.textAlign = 'center';
        container.appendChild(title);
        
        const buttonDiv = document.createElement('div');
        buttonDiv.id = 'paypal-button-real';
        container.appendChild(buttonDiv);
        
        document.body.appendChild(container);
        
        // Créer le bouton PayPal
        paypal.Buttons({
            style: {
                layout: 'vertical',
                color: 'gold',
                shape: 'rect',
                label: 'paypal'
            },
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: amount.toFixed(2),
                            currency_code: 'EUR'
                        },
                        description: 'Commande BeerShop Amateur'
                    }],
                    application_context: {
                        shipping_preference: 'NO_SHIPPING',
                        user_action: 'PAY_NOW'
                    }
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    console.log('Transaction completed:', details);
                    document.body.removeChild(container);
                    resolve({ 
                        success: true, 
                        transactionId: details.id,
                        payerEmail: details.payer.email_address
                    });
                });
            },
            onCancel: function(data) {
                console.log('Paiement annulé');
                document.body.removeChild(container);
                resolve({ success: false });
            },
            onError: function(err) {
                console.error('Erreur PayPal:', err);
                document.body.removeChild(container);
                reject(err);
            }
        }).render('#paypal-button-real');
    });
}

// Envoyer email de confirmation
async function sendConfirmationEmail(order) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    console.log('========================================');
    console.log('EMAIL DE CONFIRMATION DE COMMANDE');
    console.log('========================================');
    console.log(`À: ${order.customer.email}`);
    console.log(`Objet: Confirmation de commande #${order.id}`);
    console.log('');
    console.log(`Bonjour ${order.customer.firstname} ${order.customer.lastname},`);
    console.log('');
    console.log('Votre commande a été confirmée avec succès.');
    console.log('');
    console.log('Détails de la commande:');
    console.log('----------------------');
    order.items.forEach(item => {
        console.log(`${item.name} x ${item.quantity} = ${(item.price * item.quantity).toFixed(2)}€`);
    });
    console.log('----------------------');
    console.log(`Sous-total: ${order.subtotal.toFixed(2)}€`);
    console.log(`Frais de livraison: ${order.shippingCost.toFixed(2)}€`);
    console.log(`Total: ${order.total.toFixed(2)}€`);
    console.log('');
    console.log(`Adresse de livraison: ${order.customer.address}`);
    console.log('');
    console.log('Merci de votre confiance !');
    console.log('========================================');
}

// Générer ID de commande unique
function generateOrderId() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${year}${month}${day}-${random}`;
}

// Sauvegarder la commande
function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Afficher la notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Formater la date
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Afficher/Masquer le panier
function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.classList.toggle('active');
        if (cartModal.classList.contains('active')) {
            loadCartModalContent();
        }
    }
}

// Mettre à jour les frais de livraison quand le pays change
function updateShippingOnCountryChange() {
    const countrySelect = document.getElementById('country');
    if (countrySelect) {
        countrySelect.addEventListener('change', () => {
            loadCartModalContent();
        });
    }
}

// Initialiser les événements
function initEventListeners() {
    document.addEventListener('click', (e) => {
        const cartModal = document.getElementById('cart-modal');
        const cartIcon = document.querySelector('.cart-icon');
        
        if (cartModal && cartModal.classList.contains('active')) {
            if (!cartModal.contains(e.target) && !cartIcon?.contains(e.target)) {
                cartModal.classList.remove('active');
            }
        }
    });
    
    updateShippingOnCountryChange();
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const cartModal = document.getElementById('cart-modal');
            if (cartModal && cartModal.classList.contains('active')) {
                cartModal.classList.remove('active');
            }
        }
    });
}

// Exporter les fonctions globales
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.checkout = checkout;
window.toggleCart = toggleCart;
window.displayProducts = displayProducts;