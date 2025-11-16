import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.firstcredit.club';

// Function to create URL-friendly slug
function createSlug(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

// Function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Function to create slug from card name
function createCardSlug(cardName) {
    return createSlug(cardName);
}

// Read card data
const dataPath = path.join(__dirname, 'data.txt');
const cardData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Filter functions for different categories
function filterTravelCards(cards) {
    return cards.filter(card => {
        const name = (card['Card Name'] || '').toLowerCase();
        const benefits = (card['Key Benefits'] || '').toLowerCase();
        const type = (card['Card Type'] || '').toLowerCase();
        
        return name.includes('travel') || 
               name.includes('vistara') || 
               name.includes('atlas') || 
               name.includes('miles') ||
               benefits.includes('travel') ||
               benefits.includes('lounge') ||
               benefits.includes('miles') ||
               type.includes('travel');
    }).slice(0, 20); // Top 20 travel cards
}

function filterCashbackCards(cards) {
    return cards.filter(card => {
        const name = (card['Card Name'] || '').toLowerCase();
        const benefits = (card['Key Benefits'] || '').toLowerCase();
        const type = (card['Card Type'] || '').toLowerCase();
        
        return name.includes('cashback') || 
               name.includes('millennia') ||
               name.includes('moneyback') ||
               benefits.includes('cashback') ||
               benefits.includes('%') ||
               type.includes('cashback');
    }).slice(0, 20); // Top 20 cashback cards
}

function filterPremiumCards(cards) {
    return cards.filter(card => {
        const type = (card['Card Type'] || '').toLowerCase();
        return type.includes('premium') || type.includes('super premium');
    }).slice(0, 20); // Top 20 premium cards
}

function filterLifetimeFreeCards(cards) {
    return cards.filter(card => {
        const fee = String(card['Annual Fee (INR)'] || '').toLowerCase();
        const name = (card['Card Name'] || '').toLowerCase();
        return fee === 'free' || fee === '0' || fee === 'lifetime free' || name.includes('free');
    }).slice(0, 20); // Top 20 lifetime free cards
}

function filterBestOverallCards(cards) {
    // Mix of popular cards from different categories
    const popular = [
        'HDFC Infinia Credit Card',
        'Axis Magnus Credit Card',
        'HDFC Regalia Credit Card',
        'SBI Cashback Credit Card',
        'HDFC Millennia Credit Card',
        'Axis Bank Ace Credit Card',
        'ICICI Amazon Pay Credit Card',
        'HDFC Diners Club Black',
        'Axis Bank Atlas Credit Card',
        'SBI Card PRIME'
    ];
    
    return cards.filter(card => popular.includes(card['Card Name']));
}

// Generate category page HTML
function generateCategoryPage(categoryName, description, cards, slug) {
    const pageUrl = `${BASE_URL}/${slug}.html`;
    
    let cardsHTML = '<ul class="category-cards-list">';
    cards.forEach(card => {
        const cardName = escapeHtml(card['Card Name'] || '');
        const cardSlug = createCardSlug(card['Card Name']);
        const bank = escapeHtml(card['Bank/Issuer'] || '');
        const annualFee = escapeHtml(card['Annual Fee (INR)'] || '');
        const keyBenefits = escapeHtml(card['Key Benefits'] || '');
        
        cardsHTML += `
            <li class="category-card-item">
                <h3><a href="cards/${cardSlug}.html">${cardName}</a></h3>
                <p><strong>Bank:</strong> ${bank} | <strong>Annual Fee:</strong> ${annualFee}</p>
                <p>${keyBenefits}</p>
            </li>
        `;
    });
    cardsHTML += '</ul>';
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${categoryName} - Best Credit Cards 2025 | FirstCredit Club</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${pageUrl}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:title" content="${categoryName} - Best Credit Cards 2025">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="${BASE_URL}/Assets/logo.png">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${pageUrl}">
    <meta name="twitter:title" content="${categoryName} - Best Credit Cards 2025">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${BASE_URL}/Assets/logo.png">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "${categoryName}",
        "description": "${escapeHtml(description)}",
        "url": "${pageUrl}",
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": ${cards.length},
            "itemListElement": [
                ${cards.map((card, index) => `{
                    "@type": "ListItem",
                    "position": ${index + 1},
                    "name": "${escapeHtml(card['Card Name'] || '')}",
                    "url": "${BASE_URL}/cards/${createCardSlug(card['Card Name'])}.html"
                }`).join(',\n                ')}
            ]
        }
    }
    </script>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Syne:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
    <style>
        .category-page {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        .category-cards-list {
            list-style: none;
            padding: 0;
        }
        .category-card-item {
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1rem;
        }
        .category-card-item h3 {
            margin: 0 0 0.5rem 0;
        }
        .category-card-item h3 a {
            color: #2563eb;
            text-decoration: none;
        }
        .category-card-item h3 a:hover {
            text-decoration: underline;
        }
        .breadcrumb {
            padding: 1rem 2rem;
            background: #f9fafb;
        }
        .breadcrumb ol {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            gap: 0.5rem;
        }
        .breadcrumb li:not(:last-child)::after {
            content: '>';
            margin-left: 0.5rem;
        }
        .breadcrumb a {
            color: #2563eb;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <nav class="breadcrumb" aria-label="Breadcrumb">
        <ol>
            <li><a href="index.html">Home</a></li>
            <li aria-current="page">${categoryName}</li>
        </ol>
    </nav>
    
    <div class="category-page">
        <h1>${categoryName}</h1>
        <p>${description}</p>
        <h2>Featured Credit Cards</h2>
        ${cardsHTML}
    </div>
</body>
</html>`;
}

// Generate comparison page HTML
function generateComparisonPage(title, description, cards, slug) {
    const pageUrl = `${BASE_URL}/${slug}.html`;
    
    // Create comparison table
    let tableHTML = '<table class="comparison-table"><thead><tr><th>Feature</th>';
    cards.forEach(card => {
        tableHTML += `<th>${escapeHtml(card['Card Name'] || '')}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';
    
    // Add rows for key features
    const features = [
        { label: 'Bank', key: 'Bank/Issuer' },
        { label: 'Annual Fee', key: 'Annual Fee (INR)' },
        { label: 'Network', key: 'Network' },
        { label: 'Card Type', key: 'Card Type' },
        { label: 'Key Benefits', key: 'Key Benefits' }
    ];
    
    features.forEach(feature => {
        tableHTML += `<tr><td><strong>${feature.label}</strong></td>`;
        cards.forEach(card => {
            const value = card[feature.key] || '-';
            tableHTML += `<td>${escapeHtml(String(value))}</td>`;
        });
        tableHTML += '</tr>';
    });
    
    tableHTML += '</tbody></table>';
    
    // Card links
    let cardLinksHTML = '<div class="comparison-card-links"><h3>View Detailed Reviews</h3><ul>';
    cards.forEach(card => {
        const cardName = escapeHtml(card['Card Name'] || '');
        const cardSlug = createCardSlug(card['Card Name']);
        cardLinksHTML += `<li><a href="cards/${cardSlug}.html">${cardName} - Full Review</a></li>`;
    });
    cardLinksHTML += '</ul></div>';
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Credit Card Comparison 2025 | FirstCredit Club</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${pageUrl}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="${BASE_URL}/Assets/logo.png">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${pageUrl}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${BASE_URL}/Assets/logo.png">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "${title}",
        "description": "${escapeHtml(description)}",
        "url": "${pageUrl}"
    }
    </script>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Syne:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
    <style>
        .comparison-page {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        .comparison-table {
            width: 100%;
            border-collapse: collapse;
            margin: 2rem 0;
        }
        .comparison-table th,
        .comparison-table td {
            border: 1px solid #e0e0e0;
            padding: 1rem;
            text-align: left;
        }
        .comparison-table th {
            background: #f3f4f6;
            font-weight: 600;
        }
        .comparison-card-links {
            margin-top: 2rem;
        }
        .comparison-card-links ul {
            list-style: none;
            padding: 0;
        }
        .comparison-card-links li {
            margin: 0.5rem 0;
        }
        .comparison-card-links a {
            color: #2563eb;
            text-decoration: none;
        }
        .comparison-card-links a:hover {
            text-decoration: underline;
        }
        .breadcrumb {
            padding: 1rem 2rem;
            background: #f9fafb;
        }
        .breadcrumb ol {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            gap: 0.5rem;
        }
        .breadcrumb li:not(:last-child)::after {
            content: '>';
            margin-left: 0.5rem;
        }
        .breadcrumb a {
            color: #2563eb;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <nav class="breadcrumb" aria-label="Breadcrumb">
        <ol>
            <li><a href="index.html">Home</a></li>
            <li aria-current="page">${title}</li>
        </ol>
    </nav>
    
    <div class="comparison-page">
        <h1>${title}</h1>
        <p>${description}</p>
        ${tableHTML}
        ${cardLinksHTML}
    </div>
</body>
</html>`;
}

// Generate all category pages
const categories = [
    {
        name: 'Best Travel Credit Cards',
        slug: 'best-travel-cards',
        description: 'Compare the best travel credit cards in India 2025. Find cards with lounge access, air miles, travel insurance, and exclusive travel benefits. Compare fees, rewards, and apply for the perfect travel card.',
        filter: filterTravelCards
    },
    {
        name: 'Top Cashback Credit Cards',
        slug: 'top-cashback-cards',
        description: 'Compare the best cashback credit cards in India 2025. Get maximum cashback on shopping, dining, groceries, and online purchases. Compare cashback rates, fees, and benefits.',
        filter: filterCashbackCards
    },
    {
        name: 'Premium Credit Cards',
        slug: 'premium-cards',
        description: 'Compare premium and super premium credit cards in India 2025. Exclusive benefits, high rewards, lounge access, and premium services. Compare annual fees, benefits, and eligibility.',
        filter: filterPremiumCards
    },
    {
        name: 'Lifetime Free Credit Cards',
        slug: 'lifetime-free-cards',
        description: 'Compare lifetime free credit cards in India 2025. No annual fees, zero joining fees. Find the best free credit cards with rewards and benefits. Compare features and apply now.',
        filter: filterLifetimeFreeCards
    },
    {
        name: 'Best Overall Credit Cards 2025',
        slug: 'best-overall-cards-2025',
        description: 'Compare the best overall credit cards in India 2025. Top-rated cards with best rewards, benefits, and value. Compare fees, features, and find your perfect credit card match.',
        filter: filterBestOverallCards
    }
];

// Generate comparison pages
const comparisons = [
    {
        title: 'HDFC Infinia vs Axis Magnus Credit Card Comparison',
        slug: 'hdfc-infinia-vs-axis-magnus',
        description: 'Detailed comparison of HDFC Infinia Credit Card vs Axis Bank Magnus Credit Card. Compare fees, rewards, benefits, lounge access, and eligibility. Find which premium card is better for you.',
        cardNames: ['HDFC Infinia Credit Card', 'Axis Bank Magnus Credit Card']
    },
    {
        title: 'Top 5 Travel Credit Cards Comparison',
        slug: 'top-5-travel-cards-comparison',
        description: 'Compare the top 5 travel credit cards in India. Detailed comparison of fees, rewards, lounge access, travel insurance, and benefits. Find the best travel card for your needs.',
        cardNames: ['HDFC Regalia Credit Card', 'Axis Bank Atlas Credit Card', 'SBI Club Vistara Credit Card', 'ICICI Sapphiro Credit Card', 'HDFC Diners Club Black']
    },
    {
        title: 'Best Cashback Credit Cards Comparison',
        slug: 'best-cashback-cards-comparison',
        description: 'Compare the best cashback credit cards in India. Detailed comparison of cashback rates, categories, fees, and benefits. Find the card that gives you maximum cashback.',
        cardNames: ['SBI Cashback Credit Card', 'HDFC Millennia Credit Card', 'Axis Bank Ace Credit Card', 'ICICI Amazon Pay Credit Card', 'HDFC MoneyBack Plus Credit Card']
    }
];

console.log('Generating category pages...');
categories.forEach(category => {
    const cards = category.filter(cardData);
    const html = generateCategoryPage(category.name, category.description, cards, category.slug);
    const filePath = path.join(__dirname, `${category.slug}.html`);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ Generated ${category.slug}.html with ${cards.length} cards`);
});

console.log('\nGenerating comparison pages...');
comparisons.forEach(comparison => {
    const cards = cardData.filter(card => comparison.cardNames.includes(card['Card Name']));
    if (cards.length > 0) {
        const html = generateComparisonPage(comparison.title, comparison.description, cards, comparison.slug);
        const filePath = path.join(__dirname, `${comparison.slug}.html`);
        fs.writeFileSync(filePath, html, 'utf8');
        console.log(`✅ Generated ${comparison.slug}.html comparing ${cards.length} cards`);
    } else {
        console.warn(`⚠️  Could not find all cards for ${comparison.slug}`);
    }
});

console.log('\n✅ All category and comparison pages generated!');

