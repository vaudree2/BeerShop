// Base de données des produits
let products = [
    {
        id: 1,
        name: "Trappiste Rochefort 10",
        volume: "33cl",
        color: "Brune",
        brewery: "Abbaye Notre-Dame de Saint-Rémy",
        country: "Belgique",
        bottlingDate: "2023-03-15",
        expiryDate: "2028-03-15",
        price: 4.50,
        stock: true,
        description: "La Rochefort 10 est une bière trappiste réputée, riche et complexe avec des notes de fruits secs, de caramel et d'épices. Sa robe brune profonde et sa mousse onctueuse en font une bière d'exception pour les amateurs éclairés.",
        imageUrl: "https://images.unsplash.com/photo-1586993451228-09818021f309?w=400"
    },
    {
        id: 2,
        name: "Westvleteren 12",
        volume: "33cl",
        color: "Brune",
        brewery: "Abbaye Saint-Sixte",
        country: "Belgique",
        bottlingDate: "2023-06-10",
        expiryDate: "2028-06-10",
        price: 12.50,
        stock: true,
        description: "Considérée comme l'une des meilleures bières du monde, la Westvleteren 12 offre des arômes complexes de caramel, fruits secs et épices. Une bière rare et prisée des connaisseurs.",
        imageUrl: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400"
    },
    {
        id: 3,
        name: "Cantillon Gueuze 100% Lambic",
        volume: "75cl",
        color: "Dorée",
        brewery: "Brasserie Cantillon",
        country: "Belgique",
        bottlingDate: "2022-08-20",
        expiryDate: "2032-08-20",
        price: 18.90,
        stock: true,
        description: "Gueuze traditionnelle issue d'une fermentation spontanée. Notes acidulées, complexe et rafraîchissante. Un classique de la brasserie artisanale bruxelloise.",
        imageUrl: "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=400"
    },
    {
        id: 4,
        name: "Scotch Whisky Lagavulin 16 ans",
        volume: "70cl",
        color: "Ambré",
        brewery: "Lagavulin Distillery",
        country: "Écosse",
        bottlingDate: "2018-05-15",
        expiryDate: null,
        price: 65.00,
        stock: true,
        description: "Whisky tourbé d'Islay, emblématique de la région. Notes intenses de fumée, d'iode, de fruits secs et d'épices. Une référence pour les amateurs de whisky.",
        imageUrl: "https://images.unsplash.com/photo-1586993451228-09818021f309?w=400"
    },
    {
        id: 5,
        name: "Chimay Bleue Grand Cru",
        volume: "75cl",
        color: "Brune",
        brewery: "Abbaye de Scourmont",
        country: "Belgique",
        bottlingDate: "2023-01-20",
        expiryDate: "2028-01-20",
        price: 8.90,
        stock: true,
        description: "Bière trappiste au caractère puissant avec des notes de caramel, de fruits noirs et d'épices. Sa garde exceptionnelle lui permet d'évoluer pendant des années.",
        imageUrl: "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=400"
    },
    {
        id: 6,
        name: "Orval",
        volume: "33cl",
        color: "Ambrée",
        brewery: "Abbaye Notre-Dame d'Orval",
        country: "Belgique",
        bottlingDate: "2023-09-01",
        expiryDate: "2028-09-01",
        price: 3.80,
        stock: true,
        description: "Bière trappiste unique avec une fermentation haute et un refermentation en bouteille. Notes de fruits, d'épices et une amertume distinctive.",
        imageUrl: "https://images.unsplash.com/photo-1586993451228-09818021f309?w=400"
    },
    {
        id: 7,
        name: "Gueuze Boon Oude Geuze",
        volume: "37.5cl",
        color: "Dorée",
        brewery: "Brouwerij Boon",
        country: "Belgique",
        bottlingDate: "2022-11-15",
        expiryDate: "2032-11-15",
        price: 5.50,
        stock: true,
        description: "Gueuze authentique élaborée à partir de lambics vieillis. Acidité équilibrée, effervescence naturelle et arômes complexes.",
        imageUrl: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400"
    },
    {
        id: 8,
        name: "Bush Ambrée",
        volume: "75cl",
        color: "Ambrée",
        brewery: "Brasserie Dubuisson",
        country: "Belgique",
        bottlingDate: "2023-04-10",
        expiryDate: "2028-04-10",
        price: 7.20,
        stock: false,
        description: "Bière de garde puissante avec 12% d'alcool. Notes de caramel, fruits confits et une belle amertume. Actuellement épuisée.",
        imageUrl: "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=400"
    },
    {
        id: 9,
        name: "Glenfiddich 18 ans",
        volume: "70cl",
        color: "Ambré",
        brewery: "Glenfiddich Distillery",
        country: "Écosse",
        bottlingDate: "2019-03-20",
        expiryDate: null,
        price: 85.00,
        stock: true,
        description: "Single malt écossais vieilli en fûts de sherry Oloroso. Notes de pomme cuite, bois de chêne et épices douces.",
        imageUrl: "https://images.unsplash.com/photo-1586993451228-09818021f309?w=400"
    },
    {
        id: 10,
        name: "Delirium Tremens",
        volume: "33cl",
        color: "Blonde",
        brewery: "Brouwerij Huyghe",
        country: "Belgique",
        bottlingDate: "2023-07-15",
        expiryDate: "2026-07-15",
        price: 3.20,
        stock: true,
        description: "Bière blonde belge mondialement connue, fruitée et épicée avec une belle rondeur en bouche.",
        imageUrl: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400"
    }
];

// Charger les produits sauvegardés depuis localStorage
function loadProductsFromStorage() {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        try {
            const parsed = JSON.parse(savedProducts);
            if (Array.isArray(parsed) && parsed.length > 0) {
                products = parsed;
            }
        } catch (e) {
            console.error('Erreur lors du chargement des produits sauvegardés', e);
        }
    }
}

// Sauvegarder les produits dans localStorage
function saveProductsToStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Initialiser les produits au chargement
loadProductsFromStorage();

// Sauvegarder automatiquement quand les produits sont modifiés
const originalPush = products.push;
products.push = function(...items) {
    const result = originalPush.apply(this, items);
    saveProductsToStorage();
    return result;
};

// Intercepter les modifications directes
if (typeof Proxy !== 'undefined') {
    products = new Proxy(products, {
        set(target, property, value) {
            target[property] = value;
            saveProductsToStorage();
            return true;
        }
    });
}