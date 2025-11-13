import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to create URL-friendly slug from card name
function createSlug(cardName) {
    return cardName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
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

// Read card data
const dataPath = path.join(__dirname, 'data.txt');
const cardData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Create cards directory if it doesn't exist
const cardsDir = path.join(__dirname, 'cards');
if (!fs.existsSync(cardsDir)) {
    fs.mkdirSync(cardsDir, { recursive: true });
}

// Template for card page HTML
function generateCardPageHTML(card, slug) {
    const cardName = escapeHtml(card['Card Name'] || 'Card Details');
    const imagePath = getImagePathForCard(card['Card Name']);
    // Add ../ prefix since pages are in cards/ subdirectory
    const encodedImagePath = imagePath ? '../' + imagePath.split('/').map(part => encodeURIComponent(part)).join('/') : '';
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${cardName} - FirstCredit Club</title>
    <meta name="description" content="Detailed information about ${cardName} credit card including fees, benefits, rewards, and more.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Syne:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../styles.css">
</head>
<body class="card-detail-page">
    <div class="card-detail-header">
        <button class="card-detail-back" onclick="window.location.href='../index.html'" aria-label="Go back">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    </div>
    
    <div class="card-detail-page-content">
        <div class="card-detail-scroll">
            <div class="card-detail-image-wrapper">
                <img id="cardDetailImage" src="${encodedImagePath}" alt="${cardName}" onerror="this.style.display='none'">
            </div>
            <div class="card-detail-content" id="cardDetailContent">
                <div class="card-detail-skeleton">
                    <div class="card-detail-skeleton-block short"></div>
                    <div class="card-detail-skeleton-block medium"></div>
                    <div class="card-detail-skeleton-block full"></div>
                    <div class="card-detail-skeleton-block medium"></div>
                    <div class="card-detail-skeleton-block full"></div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // Card data for API call
        const cardData = ${JSON.stringify(card)};
        
        // Fetch card details from API
        async function loadCardDetails() {
            try {
                const response = await fetch('../api/card-details', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ card: cardData })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch card details');
                }
                
                const data = await response.json();
                renderCardDetails(data);
            } catch (error) {
                console.error('Error loading card details:', error);
                renderError(error);
            }
        }
        
        function renderCardDetails(data) {
            const content = document.getElementById('cardDetailContent');
            if (!content || !data || typeof data !== 'object') {
                renderError(new Error('Invalid data'));
                return;
            }
            
            const entries = [];
            
            function addEntry(label, value, options = {}) {
                if (!label) return;
                if (value === null || value === undefined) return;
                
                let content = value;
                if (typeof content === 'string') {
                    content = content.trim();
                }
                
                if ((typeof content === 'string' && content.length === 0) ||
                    (Array.isArray(content) && content.length === 0)) {
                    return;
                }
                
                const sanitizedLabel = escapeHtml(label);
                const useHtml = options.allowHtml === true;
                const sanitizedValue = useHtml ? content : escapeHtml(String(content));
                
                entries.push({ label: sanitizedLabel, value: sanitizedValue });
            }
            
            function escapeHtml(value) {
                return String(value)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;');
            }
            
            function formatBulletList(items) {
                if (!Array.isArray(items) || items.length === 0) return '';
                const bullets = items
                    .filter(Boolean)
                    .map(item => '<li>' + escapeHtml(item) + '</li>')
                    .join('');
                if (!bullets) return '';
                return '<ul>' + bullets + '</ul>';
            }
            
            // Process data (same logic as renderCardDetailContent in script.js)
            const summary = data.summary || {};
            const summaryTags = Array.isArray(summary.ideal_user_profiles)
                ? summary.ideal_user_profiles.filter(Boolean).map(tag => '<span class="card-detail-badge">' + escapeHtml(tag) + '</span>')
                : [];
            const summaryParts = [];
            if (summary.positioning) {
                summaryParts.push('<div>' + escapeHtml(summary.positioning) + '</div>');
            }
            if (summaryTags.length) {
                summaryParts.push('<div class="card-detail-badge-list">' + summaryTags.join('') + '</div>');
            }
            if (summaryParts.length) {
                addEntry('Summary', summaryParts.join(''), { allowHtml: true });
            }
            
            addEntry('Issuer', data.issuer);
            addEntry('Network', data.network);
            addEntry('Variant', data.variant);
            
            const fees = data.fees_charges || {};
            addEntry('Joining Fee', fees.joining_fee);
            addEntry('Annual Fee', fees.annual_fee);
            addEntry('Renewal Waiver', fees.renewal_waiver_condition);
            addEntry('Add-on Card Fee', fees.add_on_card_fee);
            addEntry('Finance Charges (APR)', fees.finance_charges_apr);
            addEntry('Cash Advance Fee', fees.cash_advance_fee);
            addEntry('Forex Markup', fees.forex_markup_fee);
            addEntry('Overlimit Fee', fees.overlimit_fee);
            addEntry('EMI Processing Fee', fees.emi_processing_fee);
            addEntry('Fuel Surcharge', fees.fuel_surcharge);
            
            const lateFees = Array.isArray(fees.late_payment_fee)
                ? fees.late_payment_fee.filter(item => item && item.slab && item.fee)
                : [];
            if (lateFees.length) {
                const html = '<ul>' + lateFees.map(item => '<li>' + escapeHtml(item.slab) + ': ' + escapeHtml(item.fee) + '</li>').join('') + '</ul>';
                addEntry('Late Payment Fee', html, { allowHtml: true });
            }
            
            const otherCharges = Array.isArray(fees.other_charges) ? fees.other_charges.filter(Boolean) : [];
            if (otherCharges.length) {
                addEntry('Other Charges', formatBulletList(otherCharges), { allowHtml: true });
            }
            
            const rewards = data.reward_structure || {};
            addEntry('Reward Currency', rewards.reward_currency);
            addEntry('Base Earn Rate', rewards.base_earn_rate);
            
            const multipliers = Array.isArray(rewards.category_multipliers)
                ? rewards.category_multipliers.filter(item => item && item.category && item.earn_rate)
                : [];
            if (multipliers.length) {
                const html = '<ul>' + multipliers.map(item => {
                    const parts = [escapeHtml(item.category) + ': ' + escapeHtml(item.earn_rate)];
                    if (item.monthly_cap) parts.push('Cap: ' + escapeHtml(item.monthly_cap));
                    if (item.exclusions) parts.push('Exclusions: ' + escapeHtml(item.exclusions));
                    return '<li>' + parts.join(' • ') + '</li>';
                }).join('') + '</ul>';
                addEntry('Category Multipliers', html, { allowHtml: true });
            }
            
            const redemption = rewards.reward_redemption || {};
            const redemptionItems = [
                redemption.catalog_value ? 'Catalog: ' + escapeHtml(redemption.catalog_value) : null,
                redemption.air_miles_transfer ? 'Air Miles: ' + escapeHtml(redemption.air_miles_transfer) : null,
                redemption.statement_credit ? 'Statement Credit: ' + escapeHtml(redemption.statement_credit) : null,
                redemption.expiry_policy ? 'Expiry: ' + escapeHtml(redemption.expiry_policy) : null
            ].filter(Boolean);
            if (redemptionItems.length) {
                addEntry('Reward Redemption', formatBulletList(redemptionItems), { allowHtml: true });
            }
            
            const welcomeData = data.welcome_and_milestone_benefits || {};
            const welcome = welcomeData.welcome_benefit || {};
            if (welcome.description || welcome.fulfilment_timeline || welcome.eligibility_condition) {
                const parts = [];
                if (welcome.description) parts.push('<div>' + escapeHtml(welcome.description) + '</div>');
                if (welcome.fulfilment_timeline) parts.push('<div>Fulfilment: ' + escapeHtml(welcome.fulfilment_timeline) + '</div>');
                if (welcome.eligibility_condition) parts.push('<div>Condition: ' + escapeHtml(welcome.eligibility_condition) + '</div>');
                addEntry('Welcome Benefit', parts.join(''), { allowHtml: true });
            }
            if (welcomeData.renewal_benefit) {
                addEntry('Renewal Benefit', welcomeData.renewal_benefit);
            }
            if (welcomeData.spend_based_fee_waiver) {
                addEntry('Spend-based Waiver', welcomeData.spend_based_fee_waiver);
            }
            const milestones = Array.isArray(welcomeData.milestone_benefits)
                ? welcomeData.milestone_benefits.filter(item => item && item.spend_threshold && item.reward)
                : [];
            if (milestones.length) {
                const html = '<ul>' + milestones.map(item => {
                    const parts = [escapeHtml(item.spend_threshold) + ': ' + escapeHtml(item.reward)];
                    if (item.notes) parts.push(escapeHtml(item.notes));
                    return '<li>' + parts.join(' • ') + '</li>';
                }).join('') + '</ul>';
                addEntry('Milestone Benefits', html, { allowHtml: true });
            }
            
            const travel = data.travel_and_lounge || {};
            const domestic = travel.domestic_lounge_access || {};
            const international = travel.international_lounge_access || {};
            
            const domesticParts = [];
            if (domestic.visits_per_year) domesticParts.push('Visits: ' + escapeHtml(domestic.visits_per_year));
            if (domestic.program) domesticParts.push('Program: ' + escapeHtml(domestic.program));
            if (domestic.guest_policy) domesticParts.push('Guests: ' + escapeHtml(domestic.guest_policy));
            if (domesticParts.length) {
                addEntry('Domestic Lounge Access', domesticParts.join(' • '), { allowHtml: true });
            }
            
            const internationalParts = [];
            if (international.free_visits) internationalParts.push('Visits: ' + escapeHtml(international.free_visits));
            if (international.program) internationalParts.push('Program: ' + escapeHtml(international.program));
            if (international.guest_policy) internationalParts.push('Guests: ' + escapeHtml(international.guest_policy));
            if (internationalParts.length) {
                addEntry('International Lounge Access', internationalParts.join(' • '), { allowHtml: true });
            }
            
            const travelExtras = Array.isArray(travel.additional_travel_benefits)
                ? travel.additional_travel_benefits.filter(Boolean)
                : [];
            if (travelExtras.length) {
                addEntry('Travel Benefits', formatBulletList(travelExtras), { allowHtml: true });
            }
            
            const insurance = data.insurance_and_protection || {};
            const travelInsurance = Array.isArray(insurance.travel_insurance)
                ? insurance.travel_insurance.filter(item => item && item.cover_type && item.coverage_amount)
                : [];
            if (travelInsurance.length) {
                const html = '<ul>' + travelInsurance.map(item => {
                    const parts = [escapeHtml(item.cover_type) + ': ' + escapeHtml(item.coverage_amount)];
                    if (item.conditions) parts.push(escapeHtml(item.conditions));
                    return '<li>' + parts.join(' • ') + '</li>';
                }).join('') + '</ul>';
                addEntry('Travel Insurance', html, { allowHtml: true });
            }
            addEntry('Purchase Protection', insurance.purchase_protection);
            addEntry('Lost Card Liability', insurance.lost_card_liability);
            addEntry('Fuel Surcharge Waiver', insurance.fuel_surcharge_waiver);
            
            const lifestyle = data.lifestyle_and_partner_offers || {};
            const addLifestyleEntry = (label, values) => {
                if (!Array.isArray(values)) return;
                const filtered = values.filter(Boolean);
                if (!filtered.length) return;
                addEntry(label, formatBulletList(filtered), { allowHtml: true });
            };
            addLifestyleEntry('Dining Programs', lifestyle.dining_programs);
            addLifestyleEntry('Entertainment', lifestyle.entertainment);
            addLifestyleEntry('Shopping Partners', lifestyle.shopping_partners);
            addLifestyleEntry('Fuel Partnerships', lifestyle.fuel_partnerships);
            addLifestyleEntry('Other Offers', lifestyle.other_weekly_monthly_offers);
            
            const addOns = data.add_on_features || {};
            addEntry('Contactless', addOns.contactless);
            addEntry('Add-on Cards', addOns.add_on_cards);
            if (Array.isArray(addOns.mobile_app_features)) {
                addEntry('App Features', formatBulletList(addOns.mobile_app_features.filter(Boolean)), { allowHtml: true });
            } else {
                addEntry('App Features', addOns.mobile_app_features);
            }
            if (Array.isArray(addOns.forex_markets)) {
                addEntry('Forex Markets', formatBulletList(addOns.forex_markets.filter(Boolean)), { allowHtml: true });
            } else {
                addEntry('Forex Markets', addOns.forex_markets);
            }
            
            const promotions = Array.isArray(data.promotions_and_limited_offers)
                ? data.promotions_and_limited_offers.filter(item => item && (item.offer_name || item.offer_details))
                : [];
            if (promotions.length) {
                const html = '<ul>' + promotions.map(item => {
                    const parts = [];
                    if (item.offer_name) parts.push(escapeHtml(item.offer_name));
                    if (item.valid_till) parts.push('Valid till ' + escapeHtml(item.valid_till));
                    if (item.offer_details) parts.push('<div>' + escapeHtml(item.offer_details) + '</div>');
                    return '<li>' + parts.join(' • ') + '</li>';
                }).join('') + '</ul>';
                addEntry('Promotions', html, { allowHtml: true });
            }
            
            if (entries.length === 0) {
                content.innerHTML = '<div class="card-detail-error"><p>Detailed information for this card is not available right now.</p></div>';
                return;
            }
            
            const rowsHtml = entries.map(entry => 
                '<div class="card-detail-key">' + entry.label + '</div>' +
                '<div class="card-detail-value">' + entry.value + '</div>'
            ).join('');
            
            const cardTitle = escapeHtml(data.card_name || cardData['Card Name'] || 'Card Details');
            
            content.innerHTML = '<section class="card-detail-section card-detail-section-single"><h3>' + cardTitle + '</h3><div class="card-detail-key-value">' + rowsHtml + '</div></section>';
        }
        
        function renderError(error) {
            const content = document.getElementById('cardDetailContent');
            if (content) {
                content.innerHTML = '<div class="card-detail-error"><p>We couldn\\'t find detailed information for this card.</p><button class="card-detail-retry" onclick="loadCardDetails()">Retry</button></div>';
            }
        }
        
        // Load details on page load
        loadCardDetails();
    </script>
</body>
</html>`;
}

// Available card images (from script.js)
const availableCardImages = [
    'AU Bank Altura Credit Card-1.png',
    'AU Bank Altura Credit Card.png',
    'AU Bank LIT Credit Card.png',
    'AU Bank Xcite Credit Card.png',
    'AU Bank Zenith Credit Card.png',
    'Amazon Pay ICICI Credit Card.png',
    'American Express Gold Card.png',
    'American Express Membership Rewards.png',
    'American Express Platinum Card.png',
    'American Express Platinum Reserve.png',
    'American Express Platinum Travel.png',
    'American Express SmartEarn.png',
    'Axis Bank Ace Credit Card.png',
    'Axis Bank Airtel Credit Card.png',
    'Axis Bank Atlas Credit Card.png',
    'Axis Bank Buzz Credit Card.png',
    'Axis Bank Flipkart Credit Card.png',
    'Axis Bank Horizon Credit Card.png',
    'Axis Bank IndianOil Credit Card.png',
    'Axis Bank Insta Easy Credit Card.png',
    'Axis Bank Magnus Credit Card.png',
    'Axis Bank Miles & More Credit Card.png',
    'Axis Bank My Zone Credit Card (Student).png',
    'Axis Bank My Zone Credit Card.png',
    'Axis Bank Neo Credit Card.png',
    'Axis Bank Reserve Credit Card.png',
    'Axis Bank Select Credit Card.png',
    'Axis Bank Vistara Infinite.png',
    'Axis Bank Vistara Signature.png',
    'BPCL SBI Card Octane Prime.png',
    'Bank of Baroda Premier Credit Card.png',
    'Bank of Baroda Prime Credit Card-1.png',
    'Bank of Baroda Prime Credit Card.png',
    'Bank of Baroda Secured Credit Card.png',
    'Bank of Baroda Select Credit Card.png',
    'DBS Vantage Credit Card.png',
    'Dhanlaxmi Bank Credit Card.png',
    'Federal Bank Celesta Credit Card.png',
    'Federal Bank Imperio Credit Card.png',
    'Federal Bank Scapia Credit Card.png',
    'Federal Bank Signet Credit Card.png',
    'HDFC Corporate Platinum Credit Card.png',
    'HDFC Diners Club Black.png',
    'HDFC Diners Club Premium.png',
    'HDFC EasyShop Platinum Credit Card.png',
    'HDFC Freedom Credit Card.png',
    'HDFC Freedom RuPay Credit Card.png',
    'HDFC ISIC Student Forex Plus.png',
    'HDFC IndiGo Credit Card.png',
    'HDFC Infinia Credit Card.png',
    'HDFC Marriott Bonvoy Credit Card.png',
    'HDFC Millennia Credit Card.png',
    'HDFC MoneyBack Plus Credit Card.png',
    'HDFC MoneyBack+ RuPay Credit Card.png',
    'HDFC Pixel Play Credit Card.png',
    'HDFC Regalia Credit Card.png',
    'HDFC Regalia Gold Credit Card.png',
    'HDFC Solitaire Credit Card.png',
    'HDFC Swiggy Credit Card.png',
    'HDFC Tata Neu Infinity Credit Card.png',
    'HDFC Tata Neu Plus Credit Card.png',
    'HSBC Premier Credit Card.png',
    'HSBC Premier World Elite Mastercard.png',
    'HSBC Smart Value Titanium.png',
    'HSBC Travel One Credit Card.png',
    'HSBC Visa Platinum Credit Card-1.png',
    'HSBC Visa Platinum Credit Card.png',
    'ICICI Amazon Pay Credit Card.png',
    'ICICI Coral Credit Card.png',
    'ICICI Diamant Credit Card.png',
    'ICICI Emeralde Credit Card.png',
    'ICICI Emeralde Private Metal.png',
    'ICICI Expressions Credit Card.png',
    'ICICI Ferrari World Credit Card.png',
    'ICICI Gold Credit Card.png',
    'ICICI HPCL Coral Credit Card.png',
    'ICICI HPCL Credit Card.png',
    'ICICI Instant Platinum Credit Card.png',
    'ICICI MMT Credit Card.png',
    'ICICI Manchester United Credit Card.png',
    'ICICI Rubyx Credit Card.png',
    'ICICI Sapphiro Credit Card.png',
    'ICICI Student Travel Credit Card.png',
    'ICICI Unifare Credit Card.png',
    'IDFC FIRST Ashva Credit Card.png',
    'IDFC FIRST Classic Credit Card.png',
    'IDFC FIRST Club Vistara.png',
    'IDFC FIRST Mayura Credit Card.png',
    'IDFC FIRST Millenia Credit Card.png',
    'IDFC FIRST Power Credit Card.png',
    'IDFC FIRST Select Credit Card.png',
    'IDFC FIRST Vistara Credit Card.png',
    'IDFC FIRST WOW Credit Card.png',
    'IDFC FIRST Wealth Credit Card.png',
    'IndusInd Bank Crest Credit Card.png',
    'IndusInd Bank Duo Credit Card.png',
    'IndusInd Bank Eazydiner Credit Card.png',
    'IndusInd Bank Legend Credit Card.png',
    'IndusInd Bank Nexxt Credit Card.png',
    'IndusInd Bank Pioneer Heritage Metal.png',
    'IndusInd Bank Platinum Aura Edge.png',
    'IndusInd Bank Platinum Credit Card.png',
    'IndusInd Bank Signature Credit Card.png',
    'Jupiter Edge CSB Bank Rupay Credit Card.png',
    'Jupiter Edge+ CSB Bank Rupay Credit Card.png',
    'Kotak 811 #DreamDifferent.png',
    'Kotak Delight Platinum.png',
    'Kotak Essentia Platinum.png',
    'Kotak IndiGo Ka-ching Credit Card.png',
    'Kotak League Platinum Credit Card.png',
    'Kotak Mahindra Aqua Gold.png',
    'Kotak Mahindra Zen Signature.png',
    'Kotak PVR Gold Credit Card.png',
    'Kotak Privy League Signature.png',
    'Kotak Royale Signature Credit Card.png',
    'Kotak Silk Inspire Credit Card.png',
    'Kotak Solaris Platinum.png',
    'Kotak Urbane Gold Credit Card.png',
    'Kotak White Credit Card.png',
    'Marriott Bonvoy American Express.png',
    'Myntra Kotak Credit Card.png',
    'Niyo Global Card.png',
    'OneCard Credit Card.png',
    'PVR Inox Kotak Credit Card.png',
    'PayTM HDFC Credit Card.png',
    'PayTM SBI Credit Card.png',
    'RBL Bank Bajaj Finserv Credit Card.png',
    'RBL Bank IndianOil XTRA.png',
    'RBL Bank Platinum Maxima.png',
    'RBL Bank Popcorn Credit Card.png',
    'RBL Bank ShopRite Credit Card.png',
    'RBL Bank World Safari.png',
    'SBI Air India Platinum Credit Card.png',
    'SBI Air India Signature Credit Card.png',
    'SBI Apollo Credit Card.png',
    'SBI Aurum Credit Card.png',
    'SBI BPCL Octane Credit Card.png',
    'SBI Card ELITE.png',
    'SBI Card PRIME.png',
    'SBI Card Unnati.png',
    'SBI Cashback Credit Card.png',
    'SBI Club Vistara Credit Card.png',
    'SBI Club Vistara Prime Credit Card.png',
    'SBI Doctor\'s Credit Card.png',
    'SBI Etihad Guest Credit Card.png',
    'SBI Flipkart Card.png',
    'SBI IRCTC Platinum Credit Card.png',
    'SBI IRCTC Premier Credit Card.png',
    'SBI Lifestyle Home Centre PRIME.png',
    'SBI Max Credit Card PRIME.png',
    'SBI Ola Money Credit Card.png',
    'SBI PhonePe PURPLE.png',
    'SBI PhonePe SELECT BLACK.png',
    'SBI Platinum Corporate Credit Card.png',
    'SBI Pulse Credit Card.png',
    'SBI Reliance Card PRIME.png',
    'SBI SimplyCLICK Credit Card.png',
    'SBI SimplySAVE Credit Card.png',
    'SBI SimplySAVE RuPay Credit Card.png',
    'SBI Tata Neu Plus Credit Card.png',
    'SBI Titan Credit Card.png',
    'SBI Unnati Secured Credit Card.png',
    'SBI Yatra Credit Card.png',
    'Slice Credit Card.png',
    'Standard Chartered DigiSmart.png',
    'Standard Chartered Emirates Skywards-1.png',
    'Standard Chartered Emirates Skywards.png',
    'Standard Chartered Manhattan Platinum Credit Card.png',
    'Standard Chartered Platinum Rewards.png',
    'Standard Chartered Priority Visa Infinite.png',
    'Standard Chartered Super Value Titanium.png',
    'Standard Chartered Ultimate Credit Card.png',
    'Uni Credit Card.png',
    'YES Bank First Exclusive Credit Card.png',
    'YES Bank First Preferred Credit Card.png',
    'YES Bank Kiwi Credit Card.png',
    'YES Bank Marquee Credit Card-1.png',
    'YES Bank Marquee Credit Card.png',
    'YES Bank Paisabazaar PaisaSave.png',
    'YES Bank Prosperity Edge Credit Card.png'
];

function normalizeCardKey(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');
}

function getImageFileNameForCard(cardName) {
    if (!cardName) return null;
    
    const exactMatch = availableCardImages.find(img => 
        img.replace('.png', '') === cardName
    );
    
    if (exactMatch) return exactMatch;
    
    const normalizedCardName = normalizeCardKey(cardName);
    const fuzzyMatch = availableCardImages.find(img => {
        const normalizedImgName = normalizeCardKey(img.replace('.png', ''));
        return normalizedImgName === normalizedCardName;
    });
    
    return fuzzyMatch || null;
}

// Helper function to get image path
function getImagePathForCard(cardName) {
    if (!cardName) return null;
    const matchedFile = getImageFileNameForCard(cardName);
    return matchedFile ? `Assets/${matchedFile}` : null;
}

// Generate pages for all cards
let generatedCount = 0;
for (const card of cardData) {
    const cardName = card['Card Name'];
    if (!cardName) continue;
    
    const slug = createSlug(cardName);
    const html = generateCardPageHTML(card, slug);
    const filePath = path.join(cardsDir, `${slug}.html`);
    
    fs.writeFileSync(filePath, html, 'utf8');
    generatedCount++;
    
    if (generatedCount % 50 === 0) {
        console.log(`Generated ${generatedCount} card pages...`);
    }
}

console.log(`✅ Generated ${generatedCount} card pages in ${cardsDir}`);

