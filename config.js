// Configuration du site
const CONFIG = {
    siteName: "BeerShop Amateur",
    siteTitle: "BeerShop Amateur - Bières d'exception pour connaisseurs",
    adminEmail: "levaudree2@gmail.com",
    currency: "€",
    shippingRates: {
        belgium: 6.90,
        europe: 12.90,
        other: 25.00
    },
    freeShippingThreshold: 100,
    // À remplacer par votre vrai Client ID PayPal pour la production
    paypalClientId: "AccGRf0jl4-U2k4AyruM8OgJZZYXi2NLIjqeasIT aZgUbyeHHzGxYHiMSaUz5gUOYjiPZ3rXLEfSKSc3",
    // Lien vers Beer Shop'E by Vaudree2 (à modifier)
    shopeeLink: "https://www.example.com/vaudree2"
};

// Ne pas modifier ci-dessous
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}