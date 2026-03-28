// Administration des produits
let editingProductId = null;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    displayAdminProducts();
    initAdminForm();
    loadOrdersList();
});

// Afficher les produits dans l'admin
function displayAdminProducts() {
    const container = document.getElementById('products-admin-container');
    if (!container) return;
    
    if (products.length === 0) {
        container.innerHTML = '<p class="no-products">Aucun produit. Cliquez sur "Ajouter" pour commencer.</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.imageUrl}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x400?text=Bi%C3%A8re'">
            <div class="product-info">
                <h3>${escapeHtml(product.name)}</h3>
                <div class="product-details">
                    ${product.price}€ | ${product.stock ? 'En stock' : 'Épuisé'}<br>
                    ${product.volume || ''} ${product.color ? `| ${product.color}` : ''}
                </div>
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <button onclick="editProduct(${product.id})" class="btn-secondary" style="flex:1;">Modifier</button>
                    <button onclick="deleteProduct(${product.id})" class="btn-secondary" style="background:#f44336; flex:1;">Supprimer</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialiser le formulaire admin
function initAdminForm() {
    const form = document.getElementById('product-form-element');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveProduct();
    });
}

// Sauvegarder un produit
function saveProduct() {
    const productData = {
        id: editingProductId || Date.now(),
        name: document.getElementById('product-name').value.trim(),
        volume: document.getElementById('product-volume').value,
        color: document.getElementById('product-color').value,
        brewery: document.getElementById('product-brewery').value,
        country: document.getElementById('product-country').value,
        bottlingDate: document.getElementById('product-bottling-date').value || null,
        expiryDate: document.getElementById('product-expiry-date').value || null,
        price: parseFloat(document.getElementById('product-price').value),
        stock: document.getElementById('product-stock').value === 'true',
        description: document.getElementById('product-description').value,
        imageUrl: document.getElementById('product-image').value || 'https://via.placeholder.com/300x400?text=Bi%C3%A8re'
    };
    
    // Validation
    if (!productData.name) {
        alert('Veuillez saisir un nom de produit');
        return;
    }
    
    if (isNaN(productData.price) || productData.price <= 0) {
        alert('Veuillez saisir un prix valide');
        return;
    }
    
    if (editingProductId) {
        // Modifier un produit existant
        const index = products.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
        }
    } else {
        // Ajouter un nouveau produit
        products.push(productData);
    }
    
    // Sauvegarder dans localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    // Recharger l'affichage
    displayAdminProducts();
    toggleProductForm(false);
    resetForm();
    
    // Mettre à jour également l'affichage dans le catalogue si on est sur une autre page
    if (typeof displayProducts !== 'undefined') {
        displayProducts(products);
    }
    
    showAdminNotification('Produit sauvegardé avec succès !', 'success');
}

// Éditer un produit
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    editingProductId = productId;
    
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-volume').value = product.volume || '';
    document.getElementById('product-color').value = product.color || 'Blonde';
    document.getElementById('product-brewery').value = product.brewery || '';
    document.getElementById('product-country').value = product.country || '';
    document.getElementById('product-bottling-date').value = product.bottlingDate || '';
    document.getElementById('product-expiry-date').value = product.expiryDate || '';
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-stock').value = product.stock.toString();
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-image').value = product.imageUrl || '';
    
    document.getElementById('form-title').textContent = 'Modifier le produit';
    toggleProductForm(true);
}

// Supprimer un produit
function deleteProduct(productId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.')) {
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products.splice(index, 1);
            localStorage.setItem('products', JSON.stringify(products));
            displayAdminProducts();
            
            // Mettre à jour l'affichage du catalogue
            if (typeof displayProducts !== 'undefined') {
                displayProducts(products);
            }
            
            showAdminNotification('Produit supprimé avec succès !', 'success');
        }
    }
}

// Afficher/masquer le formulaire
function toggleProductForm(show = null) {
    const form = document.getElementById('product-form');
    if (!form) return;
    
    if (show === null) {
        form.classList.toggle('active');
    } else {
        if (show) {
            form.classList.add('active');
        } else {
            form.classList.remove('active');
        }
    }
    
    if (!show) {
        resetForm();
        editingProductId = null;
        document.getElementById('form-title').textContent = 'Ajouter un produit';
    }
}

// Réinitialiser le formulaire
function resetForm() {
    document.getElementById('product-id').value = '';
    document.getElementById('product-name').value = '';
    document.getElementById('product-volume').value = '';
    document.getElementById('product-color').value = 'Blonde';
    document.getElementById('product-brewery').value = '';
    document.getElementById('product-country').value = '';
    document.getElementById('product-bottling-date').value = '';
    document.getElementById('product-expiry-date').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-stock').value = 'true';
    document.getElementById('product-description').value = '';
    document.getElementById('product-image').value = '';
}

// Afficher une notification dans l'admin
function showAdminNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        padding: 1rem;
        border-radius: 5px;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Charger la liste des commandes
function loadOrdersList() {
    const ordersContainer = document.getElementById('orders-list');
    if (!ordersContainer) return;
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    if (orders.length === 0) {
        ordersContainer.innerHTML = '<div class="no-orders">📭 Aucune commande pour le moment.</div>';
        return;
    }
    
    ordersContainer.innerHTML = orders.reverse().map(order => `
        <div class="order-card">
            <div class="order-header">
                <strong>📦 Commande #${order.id}</strong>
                <span class="order-date">📅 ${new Date(order.date).toLocaleString('fr-FR')}</span>
                <span class="order-status ${order.status}">${order.status === 'pending' ? '⏳ En attente' : '✅ Confirmée'}</span>
            </div>
            <div class="order-details">
                <p><strong>👤 Client:</strong> ${escapeHtml(order.customer.firstname)} ${escapeHtml(order.customer.lastname)}</p>
                <p><strong>📧 Email:</strong> ${escapeHtml(order.customer.email)}</p>
                <p><strong>📱 Téléphone:</strong> ${escapeHtml(order.customer.phone)}</p>
                <p><strong>📍 Adresse:</strong> ${escapeHtml(order.customer.address)}</p>
                <p><strong>🌍 Pays:</strong> ${order.customer.country === 'belgique' ? 'Belgique' : order.customer.country === 'europe' ? 'Europe' : 'Autre'}</p>
                ${order.customer.comment ? `<p><strong>💬 Commentaire:</strong> ${escapeHtml(order.customer.comment)}</p>` : ''}
            </div>
            <div class="order-items">
                <strong>🍺 Articles commandés:</strong>
                <ul>
                    ${order.items.map(item => `<li>${escapeHtml(item.name)} x ${item.quantity} - ${(item.price * item.quantity).toFixed(2)}€</li>`).join('')}
                </ul>
            </div>
            <div class="order-total">
                <strong>💰 Détail du paiement:</strong><br>
                Sous-total: ${order.subtotal.toFixed(2)}€<br>
                Livraison: ${order.shippingCost.toFixed(2)}€<br>
                <strong>Total: ${order.total.toFixed(2)}€</strong>
            </div>
            <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                <button onclick="markOrderAsConfirmed('${order.id}')" class="btn-primary" style="background:#4caf50;">✅ Marquer comme confirmée</button>
                <button onclick="deleteOrder('${order.id}')" class="btn-secondary" style="background:#f44336;">🗑️ Supprimer</button>
            </div>
        </div>
    `).join('');
}

// Marquer une commande comme confirmée
function markOrderAsConfirmed(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = 'confirmed';
        localStorage.setItem('orders', JSON.stringify(orders));
        loadOrdersList();
        showAdminNotification('Commande marquée comme confirmée', 'success');
    }
}

// Supprimer une commande
function deleteOrder(orderId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const filteredOrders = orders.filter(o => o.id !== orderId);
        localStorage.setItem('orders', JSON.stringify(filteredOrders));
        loadOrdersList();
        showAdminNotification('Commande supprimée', 'success');
    }
}

// Changer d'onglet
function showTab(tabName) {
    // Masquer tous les onglets
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Désactiver tous les boutons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Afficher l'onglet sélectionné
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Activer le bouton correspondant
    event.target.classList.add('active');
    
    // Recharger les données si nécessaire
    if (tabName === 'orders') {
        loadOrdersList();
    }
}

// Échapper les caractères HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Exporter les commandes
function exportOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    if (orders.length === 0) {
        alert('Aucune commande à exporter');
        return;
    }
    
    const dataStr = JSON.stringify(orders, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `commandes_beershop_${new Date().toISOString().slice(0,10)}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showAdminNotification('Commandes exportées avec succès !', 'success');
}

// Exporter les fonctions globales
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.toggleProductForm = toggleProductForm;
window.showTab = showTab;
window.exportOrders = exportOrders;
window.markOrderAsConfirmed = markOrderAsConfirmed;
window.deleteOrder = deleteOrder;