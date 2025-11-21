// Version: 2025-01-15-v7 - Only render cards with exact image matches
// Card data will be loaded from data.txt
let cardData = []; // All cards from data.txt
let renderedCards = []; // Only cards with exact image matches (displayed in grid)
let cardColorsByImage = {}; // Color metadata loaded from cardColors.json
let cardColorsLoaded = false;

// Available credit card images in Assets folder
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

// Filter logo assets mapping
const filterLogoFileMap = {
    'au bank': 'au bank.png',
    'axis bank': 'axis bank.png',
    'american express': 'american express.png',
    'bank of baroda': 'bank of baroda.png',
    'dbs bank': 'dbs bank.png',
    'dhanlaxmi bank': 'dhanlaxmi bank.png',
    'federal bank': 'federal bank.png',
    'hdfc bank': 'hdfc bank.png',
    'hsbc bank': 'hsbc bank.png',
    'icici bank': 'icici bank.png',
    'idfc bank': 'idfc bank.png',
    'indusind bank': 'indusland logo.png',
    'jupiter': 'jupiter logo.png',
    'kotak bank': 'kotak bank.png',
    'mastercard': 'mastercard.png',
    'niyo': 'niyo bank.png',
    'onecard': 'onecard.png',
    'rbl bank': 'rbl bank.png',
    'rupay': 'rupay.png',
    'sbi bank': 'sbi bank.png',
    'slice': 'slice.png',
    'standard chartered': 'standard chartered.png',
    'uni cards': 'uni cards.png',
    'visa': 'visa.png',
    'yes bank': 'yes bank.png',
    'diners club': 'dinners club.png'
};

// Additional aliases for logo lookup
const filterLogoAliases = {
    'au small finance bank': 'au bank',
    'american express banking corp.': 'american express',
    'american express banking corp': 'american express',
    'american express bank': 'american express',
    'american express company': 'american express',
    'dbs bank india limited': 'dbs bank',
    'dbs bank india': 'dbs bank',
    'dbs bank ltd.': 'dbs bank',
    'dbs': 'dbs bank',
    'dhanlaxmi bank ltd': 'dhanlaxmi bank',
    'federal bank ltd': 'federal bank',
    'hdfc': 'hdfc bank',
    'hsbc': 'hsbc bank',
    'hsbc ltd': 'hsbc bank',
    'hsbc india': 'hsbc bank',
    'hsbc bank ltd': 'hsbc bank',
    'hsbc bank limited': 'hsbc bank',
    'icici': 'icici bank',
    'icici bank ltd': 'icici bank',
    'icici bank limited': 'icici bank',
    'idfc first bank': 'idfc bank',
    'idfc first bank ltd': 'idfc bank',
    'idfc bank ltd': 'idfc bank',
    'idfc bank limited': 'idfc bank',
    'indusind bank ltd': 'indusind bank',
    'indusind bank limited': 'indusind bank',
    'indusland bank': 'indusind bank',
    'indusland': 'indusind bank',
    'jupiter money': 'jupiter',
    'jupiter edge': 'jupiter',
    'kotak mahindra bank': 'kotak bank',
    'kotak mahindra bank ltd': 'kotak bank',
    'kotak bank ltd': 'kotak bank',
    'master card': 'mastercard',
    'niyo money': 'niyo',
    'one card': 'onecard',
    'onecard credit card': 'onecard',
    'onecard metal': 'onecard',
    'rbl': 'rbl bank',
    'rbl bank ltd': 'rbl bank',
    'state bank of india': 'sbi bank',
    'sbi': 'sbi bank',
    'sbi cards': 'sbi bank',
    'standard chartered bank': 'standard chartered',
    'standard chartered plc': 'standard chartered',
    'standard chartered bank india': 'standard chartered',
    'uni card': 'uni cards',
    'uni': 'uni cards',
    'yes bank ltd': 'yes bank',
    'yes bank limited': 'yes bank',
    'master card': 'mastercard',
    'diners club international': 'diners club',
    'diners club': 'diners club'
};

// Mobile card detail view state
let detailOverlay = null;
let detailCard = null;
let detailImage = null;
let detailContent = null;
let detailCloseButton = null;
let cardDetailInitialized = false;
let activeCardDetail = null;
let cardDetailAbortController = null;

// Mobile scroll mode state
let mobileScrollMode = 'vertical'; // 'vertical' or 'horizontal'


function isMobileViewport() {
    return window.innerWidth <= 768;
}

function normalizeCardKey(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');
}

// Function to create URL-friendly slug from card name
function createCardSlug(cardName) {
    return cardName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Navigate to card detail page
function navigateToCardPage(card) {
    if (!card || !card['Card Name']) return;
    const slug = createCardSlug(card['Card Name']);
    window.location.href = `cards/${slug}.html`;
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

// Function to check if a card has an exact image match
function hasImageMatch(cardName) {
    if (!cardName) return false;
    return !!getImageFileNameForCard(cardName);
}

// Function to get image path for a card by matching name
function getImagePathForCard(cardName) {
    if (!cardName) return null;
    const matchedFile = getImageFileNameForCard(cardName);
    return matchedFile ? `Assets/${matchedFile}` : null;
}

// Grid configuration
const IMAGE_WIDTH = 257; // Width of each image in pixels
const IMAGE_HEIGHT = 158; // Height of each image in pixels
const GAP = 71; // Horizontal gap between images

// Grid size will be calculated dynamically to always be square
let GRID_SIZE = 20; // Will be updated based on card count (rows = cols)

// Sort cards by color order (matching gradient order)
function sortCardsByColorOrder(cards) {
    if (!colorGradientFamilies.length || !cardColorsByImage || Object.keys(cardColorsByImage).length === 0) {
        return cards;
    }
    
    // Create a map of color family to index in gradient
    const colorOrderMap = new Map();
    colorGradientFamilies.forEach((color, index) => {
        colorOrderMap.set(color.family, index);
    });
    
    // Sort cards by their color family's position in gradient
    return [...cards].sort((a, b) => {
        const imageA = getImageFileNameForCard(a['Card Name']);
        const imageB = getImageFileNameForCard(b['Card Name']);
        
        const colorA = cardColorsByImage[imageA]?.colorFamily;
        const colorB = cardColorsByImage[imageB]?.colorFamily;
        
        const orderA = colorOrderMap.has(colorA) ? colorOrderMap.get(colorA) : 9999;
        const orderB = colorOrderMap.has(colorB) ? colorOrderMap.get(colorB) : 9999;
        
        if (orderA !== orderB) {
            return orderA - orderB;
        }
        
        // If same color, maintain original order
        return 0;
    });
}

// Load card data from data.txt and filter to only cards with images
async function loadCardData() {
    try {
        const response = await fetch('data.txt');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = (await response.text()).trim();
        
        // Check if file is empty
        if (!text || text.length === 0) {
            throw new Error('data.txt is empty');
        }
        
        // Try to parse JSON
        cardData = JSON.parse(text);
        
        // Validate it's an array
        if (!Array.isArray(cardData)) {
            throw new Error('data.txt does not contain a valid JSON array');
        }
        
        console.log(`Loaded ${cardData.length} credit cards from data.txt`);
        
        // Filter to only cards with exact image matches
        renderedCards = cardData.filter(card => hasImageMatch(card['Card Name']));
        
        console.log(`Filtered to ${renderedCards.length} cards with images (${cardData.length - renderedCards.length} cards without images excluded)`);
        
        return renderedCards;
    } catch (error) {
        console.error('Error loading card data:', error);
        throw error; // Re-throw to let caller handle
    }
}

async function loadCardColors() {
    if (cardColorsLoaded) {
        return cardColorsByImage;
    }
    
    try {
        const response = await fetch('cardColors.json', {
            cache: 'no-store'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        if (!text) {
            throw new Error('cardColors.json is empty');
        }
        
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed === 'object' && parsed.cards && typeof parsed.cards === 'object') {
            cardColorsByImage = parsed.cards;
        } else {
            throw new Error('cardColors.json is missing the "cards" map');
        }
        
        console.log(`Loaded color metadata for ${Object.keys(cardColorsByImage).length} images`);
    } catch (error) {
        console.warn('Unable to load card color data:', error);
        cardColorsByImage = {};
    } finally {
        cardColorsLoaded = true;
    }
    
    return cardColorsByImage;
}

// Scroll to the first card of a specific color family
function scrollToColorSection(colorFamily) {
    const canvasContainer = document.getElementById('canvasContainer');
    if (!canvasContainer) return;
    
    // Find the first card item with this color in the currently rendered cards
    // This works with filtered results too - it searches through visible cards only
    const cardItems = document.querySelectorAll('.image-item');
    let firstCardIndex = -1;
    
    for (let i = 0; i < cardItems.length; i++) {
        const cardItem = cardItems[i];
        const imagePath = cardItem.dataset.imagePath;
        if (!imagePath) continue;
        
        const imageFileName = imagePath.replace('Assets/', '');
        const colorInfo = cardColorsByImage[imageFileName];
        if (colorInfo && colorInfo.colorFamily === colorFamily) {
            firstCardIndex = i;
            break;
        }
    }
    
    // If no card with this color found in current results, silently return
    // (This can happen if cards are filtered and this color isn't in the filtered set)
    if (firstCardIndex === -1) {
        console.log(`No cards with color "${colorFamily}" found in current view`);
        return;
    }
    
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Mobile: scroll to the card item
        if (cardItems[firstCardIndex]) {
            cardItems[firstCardIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    } else {
        // Desktop: calculate position in grid
        const totalCards = cardItems.length;
        const gridSize = Math.ceil(Math.sqrt(totalCards));
        const row = Math.floor(firstCardIndex / gridSize);
        const col = firstCardIndex % gridSize;
        
        const CARD_TOTAL_HEIGHT = 200;
        const cardY = row * (CARD_TOTAL_HEIGHT + GAP) + GAP;
        const cardX = col * (IMAGE_WIDTH + GAP) + GAP;
        
        // Scroll to center the card in viewport
        const scrollY = cardY - (window.innerHeight / 2) + (CARD_TOTAL_HEIGHT / 2);
        const scrollX = cardX - (window.innerWidth / 2) + (IMAGE_WIDTH / 2);
        
        canvasContainer.scrollTo({
            left: Math.max(0, scrollX),
            top: Math.max(0, scrollY),
            behavior: 'smooth'
        });
    }
}

// Initialize canvas
async function initCanvas() {
    try {
        // Load card data first
        await loadCardData();
        await loadCardColors();
        
        // If no cards with images, show error
        if (renderedCards.length === 0) {
            console.error('No cards with images found.');
            const canvas = document.getElementById('canvas');
            canvas.innerHTML = '<div style="padding: 50px; text-align: center; color: #999;">No cards with images found. Please add credit card images to Assets folder.</div>';
            return;
        }
        
        // Sort cards by color order after colors are loaded
        // This will happen after createFilters() sets up colorGradientFamilies
    } catch (error) {
        console.error('Failed to initialize:', error);
        const canvas = document.getElementById('canvas');
        canvas.innerHTML = '<div style="padding: 50px; text-align: center; color: #999;">Error loading card data. Check console for details.</div>';
        return;
    }
    
    const canvas = document.getElementById('canvas');
    const canvasContainer = document.getElementById('canvasContainer');
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Mobile: Don't set fixed dimensions, let it flow naturally
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        
        // Create vertical stack based on rendered cards
        createGrid(canvas);
    } else {
        // Desktop: Calculate square grid size based on rendered cards count
        const totalCards = renderedCards.length;
        // Calculate grid size to be square (rows = cols)
        GRID_SIZE = Math.ceil(Math.sqrt(totalCards));
        console.log(`Creating ${GRID_SIZE}×${GRID_SIZE} square grid for ${totalCards} cards`);
        
        // Set grid template columns dynamically
        canvas.style.gridTemplateColumns = `repeat(${GRID_SIZE}, ${IMAGE_WIDTH}px)`;
        
        // Card height includes: image (158px) + card name (9+16=25px) + network (5+11=16px) = ~200px
        const CARD_TOTAL_HEIGHT = 200;
        const totalWidth = GRID_SIZE * (IMAGE_WIDTH + GAP) + GAP;
        const totalHeight = GRID_SIZE * (CARD_TOTAL_HEIGHT + GAP) + GAP;
        
        // Set canvas size - use min-height to allow grid to grow with content
        canvas.style.width = `${totalWidth}px`;
        canvas.style.minHeight = `${totalHeight}px`;
        canvas.style.height = 'auto';
        
        // Start at center
        const startX = (totalWidth - window.innerWidth) / 2;
        const startY = (totalHeight - window.innerHeight) / 2;
        
        // Create grid of images
        createGrid(canvas);
        
        // Setup smooth scrolling handlers
        setupSmoothScrolling(canvasContainer);
        
        // Scroll to center after a short delay
        setTimeout(() => {
            canvasContainer.scrollTo({
                left: startX,
                top: startY,
                behavior: 'auto'
            });
            // Initialize scroll position tracking after initial scroll
            lastScrollPosition.x = canvasContainer.scrollLeft;
            lastScrollPosition.y = canvasContainer.scrollTop;
            
            // Start ripple animation AFTER scrolling to center is complete
            // This ensures cards are at opacity 0 until user is centered
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    startRippleAnimation();
                });
            });
        }, 100);
    }
}

// Ripple animation from center (desktop only)
function startRippleAnimation() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return; // Only for desktop
    
    // Calculate center position of the square grid
    const centerRow = Math.floor(GRID_SIZE / 2);
    const centerCol = Math.floor(GRID_SIZE / 2);
    
    console.log(`Starting ripple from center: row ${centerRow}, col ${centerCol}`);
    
    // Get all image items and calculate their distance from center
    const imageItems = document.querySelectorAll('.image-item');
    const itemsWithDistance = [];
    
    imageItems.forEach((item) => {
        const row = parseInt(item.dataset.row);
        const col = parseInt(item.dataset.col);
        
        // Calculate Euclidean distance from center
        const distance = Math.sqrt(
            Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2)
        );
        
        itemsWithDistance.push({ item, distance });
    });
    
    // Animate each card based on distance from center
    itemsWithDistance.forEach(({ item, distance }) => {
        // Delay increases with distance from center
        // Each "ring" of distance gets 30ms delay
        const delay = distance * 30;
        
        setTimeout(() => {
            item.style.opacity = '1';
        }, delay);
    });
}

// Enhanced smooth scroll with momentum for diagonal scrolling
let scrollVelocity = { x: 0, y: 0 };
let lastScrollTime = Date.now();
let lastScrollPosition = { x: 0, y: 0 };
let isScrolling = false;
let scrollAnimationFrame = null;

function setupSmoothScrolling(canvasContainer) {
    // Track scroll velocity for smooth diagonal scrolling
    canvasContainer.addEventListener('scroll', () => {
        const now = Date.now();
        const deltaTime = now - lastScrollTime;
        
        if (deltaTime > 0) {
            const currentX = canvasContainer.scrollLeft;
            const currentY = canvasContainer.scrollTop;
            
            scrollVelocity.x = (currentX - lastScrollPosition.x) / deltaTime;
            scrollVelocity.y = (currentY - lastScrollPosition.y) / deltaTime;
            
            lastScrollPosition.x = currentX;
            lastScrollPosition.y = currentY;
            lastScrollTime = now;
            isScrolling = true;
        }
    }, { passive: true });

    // Enhanced smooth wheel scrolling with momentum and easing
    let wheelTimeout;
    let momentumAnimationId = null;
    
    canvasContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        const deltaX = e.deltaX || 0;
        const deltaY = e.deltaY || 0;
        
        // Cancel any existing momentum animation
        if (momentumAnimationId) {
            cancelAnimationFrame(momentumAnimationId);
            momentumAnimationId = null;
        }
        
        // Clear any existing timeout
        clearTimeout(wheelTimeout);
        
        // Use requestAnimationFrame for smoother scrolling
        if (scrollAnimationFrame) {
            cancelAnimationFrame(scrollAnimationFrame);
        }
        
        scrollAnimationFrame = requestAnimationFrame(() => {
            // Apply smooth scrolling with enhanced delta
            const smoothX = deltaX * 1.1; // Slight enhancement for smoother feel
            const smoothY = deltaY * 1.1;
            
            canvasContainer.scrollBy({
                left: smoothX,
                top: smoothY,
                behavior: 'auto'
            });
        });
        
        // Reset scrolling flag after a delay
        wheelTimeout = setTimeout(() => {
            isScrolling = false;
        }, 150);
    }, { passive: false });
}


// Create grid of images based on card data
function createGrid(canvas) {
    const isMobile = window.innerWidth <= 768;
    
    // Extract colors and set up gradient BEFORE sorting cards
    // Gradient is created in natural color spectrum order (rainbow-like)
    const filterValues = extractFilterValues();
    renderColorGradient(filterValues.colors);
    
    // Debug: Log gradient order
    if (colorGradientFamilies.length > 0) {
        console.log('Gradient color order (natural spectrum):', colorGradientFamilies.map(c => c.family).join(' → '));
    }
    
    // Now sort cards by color order (matching gradient order)
    // Cards are sorted to match the natural gradient order:
    // First color in gradient → First cards rendered
    // Last color in gradient → Last cards rendered
    let cardsToRender = renderedCards;
    if (colorGradientFamilies.length > 0) {
        cardsToRender = sortCardsByColorOrder(renderedCards);
        console.log(`Sorted ${cardsToRender.length} cards to match natural gradient color order`);
        
        // Debug: Log first and last few cards' colors to verify sorting
        const firstFewColors = cardsToRender.slice(0, 5).map(card => {
            const img = getImageFileNameForCard(card['Card Name']);
            return cardColorsByImage[img]?.colorFamily || 'unknown';
        });
        const lastFewColors = cardsToRender.slice(-5).map(card => {
            const img = getImageFileNameForCard(card['Card Name']);
            return cardColorsByImage[img]?.colorFamily || 'unknown';
        });
        console.log('First 5 cards colors:', firstFewColors.join(', '));
        console.log('Last 5 cards colors:', lastFewColors.join(', '));
        console.log(`Gradient starts with: ${colorGradientFamilies[0]?.family}, ends with: ${colorGradientFamilies[colorGradientFamilies.length - 1]?.family}`);
    }
    
    const totalCards = cardsToRender.length || 0;
    
    console.log(`Creating grid with ${totalCards} cards with images`);
    
    if (totalCards === 0) {
        console.warn('No cards with images to render');
        return;
    }
    
    // Clear existing items
    allImageItems = [];
    
    if (isMobile) {
        const canvasContainer = document.getElementById('canvasContainer');
        // Mobile: Create layout based on scroll mode
        if (mobileScrollMode === 'horizontal') {
            // Horizontal: Create horizontal row with portrait cards
            canvas.classList.add('horizontal-scroll');
            if (canvasContainer) {
                canvasContainer.classList.add('horizontal-scroll-mode');
            }
            for (let i = 0; i < totalCards; i++) {
                const card = cardsToRender[i];
                const imagePath = getImagePathForCard(card['Card Name']);
                
                if (i < 5) {
                    console.log(`Card ${i}: "${card['Card Name']}" -> ${imagePath}`);
                }
                
                const imageItem = createImageItem(imagePath, card, i, 0);
                imageItem.dataset.cardIndex = i;
                imageItem.classList.add('portrait-card');
                canvas.appendChild(imageItem);
                allImageItems.push(imageItem);
            }
        } else {
            // Vertical: Create vertical stack (existing behavior)
            canvas.classList.remove('horizontal-scroll');
            if (canvasContainer) {
                canvasContainer.classList.remove('horizontal-scroll-mode');
            }
            for (let i = 0; i < totalCards; i++) {
                const card = cardsToRender[i];
                const imagePath = getImagePathForCard(card['Card Name']);
                
                if (i < 5) {
                    console.log(`Card ${i}: "${card['Card Name']}" -> ${imagePath}`);
                }
                
                const imageItem = createImageItem(imagePath, card, 0, i);
                imageItem.dataset.cardIndex = i;
                imageItem.classList.remove('portrait-card');
                canvas.appendChild(imageItem);
                allImageItems.push(imageItem);
            }
        }
    } else {
        // Desktop: Create square grid based on rendered cards
        let cardIndex = 0;
        for (let row = 0; row < GRID_SIZE && cardIndex < totalCards; row++) {
            for (let col = 0; col < GRID_SIZE && cardIndex < totalCards; col++) {
                const card = cardsToRender[cardIndex];
                // Get matched image for this card (guaranteed to exist)
                const imagePath = getImagePathForCard(card['Card Name']);
                
                // Debug first 5 matches
                if (cardIndex < 5) {
                    console.log(`Card ${cardIndex}: "${card['Card Name']}" -> ${imagePath}`);
                }
                
                // Create image item with card data
                const imageItem = createImageItem(imagePath, card, row, col);
                canvas.appendChild(imageItem);
                allImageItems.push(imageItem);
                cardIndex++;
            }
        }
    }
    
    console.log(`Created ${totalCards} card items (all with images)`);
    
    // Create filters after cards are created (gradient is already set up)
    createFilters();
}

// Create an image item element with card data (same for mobile and desktop)
function createImageItem(imagePath, card, row, col) {
    const imageItem = document.createElement('div');
    imageItem.className = 'image-item';
    imageItem.dataset.imagePath = imagePath;
    imageItem.dataset.row = row;
    imageItem.dataset.col = col;
    
    // Store card data for filtering
    if (card) {
        imageItem.dataset.network = card['Network'] || '';
        imageItem.dataset.bank = card['Bank/Issuer'] || '';
        // Determine if paid or free based on annual fee
        const annualFee = card['Annual Fee (INR)'];
        const feeValue = typeof annualFee === 'string' ? parseInt(annualFee.replace(/,/g, '')) : annualFee;
        imageItem.dataset.feeType = (feeValue && feeValue > 0) ? 'Paid' : 'Free';
    }
    
    const imageFileName = imagePath ? imagePath.split('/').pop() : null;
    if (imageFileName && cardColorsByImage && cardColorsByImage[imageFileName]) {
        const colorInfo = cardColorsByImage[imageFileName];
        if (colorInfo.dominantHex) {
            imageItem.dataset.colorHex = colorInfo.dominantHex;
        }
        if (colorInfo.colorFamily) {
            imageItem.dataset.color = colorInfo.colorFamily;
        }
    }
    
    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';
    
    // Create image (imagePath is always defined now)
    const img = document.createElement('img');
    const pathParts = imagePath.split('/');
    const encodedPath = pathParts.map(part => encodeURIComponent(part)).join('/');
    img.src = encodedPath;
    img.alt = card ? card['Card Name'] : imagePath.split('/').pop();
    
    // Performance optimizations
    const isMobile = window.innerWidth <= 768;
    
    // Determine if image is above the fold
    // Mobile: first 3 cards (row=0, col=0,1,2)
    // Desktop: first row, first 3 columns
    let isAboveFold = false;
    if (isMobile) {
        isAboveFold = (row === 0 && col < 3);
    } else {
        isAboveFold = (row === 0 && col < 3);
    }
    
    // Set dimensions to prevent layout shift
    if (isMobile) {
        // Mobile dimensions will be set by CSS, but we set width/height for CLS
        img.width = 340; // Approximate mobile width (85vw on mobile)
        img.height = 209; // Approximate mobile height (maintaining aspect ratio)
    } else {
        img.width = 257;
        img.height = 158;
    }
    
    // Optimize loading: eager for above-fold, lazy for others
    if (isAboveFold) {
        img.loading = 'eager';
        if (row === 0 && col === 0) {
            img.fetchPriority = 'high'; // Highest priority for first image
        } else {
            img.fetchPriority = 'auto'; // Auto for other above-fold images
        }
    } else {
        img.loading = 'lazy';
        img.fetchPriority = 'low';
    }
    
    img.decoding = 'async';
    
    img.onload = () => {
        // On mobile, make visible immediately
        // On desktop, keep opacity 0 until ripple animation
        if (isMobile) {
            imageItem.classList.add('visible');
        }
    };
    
    img.onerror = (e) => {
        console.error('Failed to load image:', imagePath);
        imageContainer.style.background = '#e5e5e5';
        imageContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999; font-size: 12px;">Image not found</div>';
    };
    
    imageContainer.appendChild(img);
    
    // Add "No annual fee" diagonal strip for free cards
    if (card) {
        const annualFee = card['Annual Fee (INR)'];
        const feeValue = typeof annualFee === 'string' ? parseInt(annualFee.replace(/,/g, '')) : annualFee;
        
        // Show strip only if card is free (no annual fee or fee is 0)
        if (!feeValue || feeValue === 0) {
            const noFeeStrip = document.createElement('div');
            noFeeStrip.className = 'no-fee-strip';
            noFeeStrip.textContent = 'NO ANNUAL FEE';
            imageContainer.appendChild(noFeeStrip);
            // Add class to container for CSS targeting
            imageContainer.classList.add('has-no-fee-strip');
        }
    }
    
    imageItem.appendChild(imageContainer);
    
    // Add card information below image if card data exists
    if (card) {
        const cardInfo = document.createElement('div');
        cardInfo.className = 'card-info';
        
        // Card Name - 13px, black 79% opacity, 9px margin-top
        const cardName = document.createElement('div');
        cardName.className = 'card-name';
        cardName.textContent = card['Card Name'] || '';
        cardInfo.appendChild(cardName);
        
        // Network Name - 9px, all caps, 8% letter spacing, 60% opacity, 5px margin-top
        const networkName = document.createElement('div');
        networkName.className = 'card-network';
        networkName.textContent = (card['Network'] || '').toUpperCase();
        cardInfo.appendChild(networkName);
        
        imageItem.appendChild(cardInfo);
    }
    
    if (card && isMobileViewport()) {
        imageItem.addEventListener('click', () => {
            navigateToCardPage(card);
        });
    }
    
    return imageItem;
}

// Filter functionality
let activeFilter = null;
let allImageItems = [];

let colorGradientContainer = null;
let colorGradientBar = null;
let colorGradientIndicator = null;
let colorGradientFamilies = [];
let colorGradientActiveIndex = null;
let isDraggingGradient = false;
let gradientDragStartX = 0;
let gradientDragStartScrollTop = 0;

// Natural color spectrum order (rainbow-like progression)
function getNaturalColorOrder() {
    // Order: Red → Orange → Yellow → Lime → Green → Teal → Cyan → Blue → Indigo → Purple → Pink → Brown → Gray → Black → White
    return [
        'Red',
        'Orange',
        'Yellow',
        'Lime',
        'Green',
        'Teal',
        'Cyan',
        'Blue',
        'Indigo',
        'Purple',
        'Pink',
        'Brown',
        'Gray',
        'Black',
        'White'
    ];
}

// Get position of color in natural spectrum order
function getColorSpectrumIndex(colorFamily) {
    const naturalOrder = getNaturalColorOrder();
    const index = naturalOrder.indexOf(colorFamily);
    return index >= 0 ? index : 9999; // Unknown colors go to end
}

// Extract unique filter values from card data
function extractFilterValues() {
    const networks = new Set();
    const banks = new Set();
    const feeTypes = new Set(['Paid', 'Free']);
    const colors = new Map();
    
    // Only extract values from cards that are actually rendered
    renderedCards.forEach(card => {
        if (card['Network']) networks.add(card['Network']);
        if (card['Bank/Issuer']) banks.add(card['Bank/Issuer']);
        
        if (!cardColorsByImage || Object.keys(cardColorsByImage).length === 0) {
            return;
        }
        
        const imageFileName = getImageFileNameForCard(card['Card Name']);
        if (!imageFileName) return;
        
        const colorInfo = cardColorsByImage[imageFileName];
        if (!colorInfo || !colorInfo.colorFamily) return;
        
        const family = colorInfo.colorFamily;
        if (!colors.has(family)) {
            colors.set(family, {
                count: 0,
                sampleHex: colorInfo.dominantHex || ''
            });
        }
        const entry = colors.get(family);
        entry.count += 1;
        if (!entry.sampleHex && colorInfo.dominantHex) {
            entry.sampleHex = colorInfo.dominantHex;
        }
    });
    
    // Sort colors by natural spectrum order (not by frequency)
    const colorFilters = Array.from(colors.entries())
        .sort((a, b) => {
            const orderA = getColorSpectrumIndex(a[0]);
            const orderB = getColorSpectrumIndex(b[0]);
            return orderA - orderB; // Sort by natural color order
        })
        .map(([family, data]) => ({
            family,
            sampleHex: data.sampleHex
        }));
    
    return {
        networks: Array.from(networks).sort(),
        banks: Array.from(banks).sort(),
        feeTypes: Array.from(feeTypes),
        colors: colorFilters
    };
}

// Create filter buttons
function createFilters() {
    const filtersScroll = document.getElementById('filtersScroll');
    if (!filtersScroll) return;
    
    const filterValues = extractFilterValues();
    
    // Clear existing filters
    filtersScroll.innerHTML = '';
    
    // Add mobile scroll mode toggle (only on mobile)
    if (window.innerWidth <= 768) {
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'scroll-mode-toggle-container';
        
        const toggleButton = document.createElement('button');
        toggleButton.className = 'scroll-mode-toggle';
        toggleButton.setAttribute('aria-label', 'Toggle scroll direction');
        toggleButton.innerHTML = mobileScrollMode === 'vertical' 
            ? '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3L10 17M10 17L6 13M10 17L14 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
            : '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10L17 10M17 10L13 6M17 10L13 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        
        toggleButton.addEventListener('click', () => {
            mobileScrollMode = mobileScrollMode === 'vertical' ? 'horizontal' : 'vertical';
            toggleButton.innerHTML = mobileScrollMode === 'vertical'
                ? '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3L10 17M10 17L6 13M10 17L14 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
                : '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10L17 10M17 10L13 6M17 10L13 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            
            // Recreate grid with new scroll mode
            const canvas = document.getElementById('canvas');
            if (canvas) {
                applyFilter(activeFilter?.filterType, activeFilter?.filterValue, false);
                // Reinitialize rotation after a short delay
                setTimeout(() => {
                    setupMobileDynamicRotation();
                }, 400);
            }
        });
        
        toggleContainer.appendChild(toggleButton);
        filtersScroll.appendChild(toggleContainer);
    }
    
    // Gradient is already rendered in createGrid(), so we don't need to render it again
    // But if it wasn't rendered (edge case), render it now
    if (colorGradientFamilies.length === 0) {
        renderColorGradient(filterValues.colors);
    }
    
    // Network filters
    filterValues.networks.forEach(network => {
        const filterTab = createFilterTabElement(network, 'network', network);
        filtersScroll.appendChild(filterTab);
    });
    
    // Fee type filters
    filterValues.feeTypes.forEach(feeType => {
        const filterTab = createFilterTabElement(feeType, 'feeType', feeType);
        filtersScroll.appendChild(filterTab);
    });
    
    // Bank filters
    filterValues.banks.forEach(bank => {
        const filterTab = createFilterTabElement(bank, 'bank', bank);
        filtersScroll.appendChild(filterTab);
    });
}

function normalizeFilterName(name) {
    return name
        .toLowerCase()
        .replace(/[\u2019']/g, "'")
        .replace(/[.]/g, '')
        .replace(/-/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function getFilterLogoPath(filterName) {
    if (!filterName) return null;
    const normalized = normalizeFilterName(filterName);
    if (filterLogoFileMap[normalized]) {
        return `filter-logo-assets/${filterLogoFileMap[normalized]}`;
    }
    
    if (filterLogoAliases[normalized]) {
        const mappedKey = filterLogoAliases[normalized];
        if (filterLogoFileMap[mappedKey]) {
            return `filter-logo-assets/${filterLogoFileMap[mappedKey]}`;
        }
    }
    
    const fallbackMatch = Object.entries(filterLogoFileMap).find(([key]) => {
        return normalized === key || normalized.includes(key) || key.includes(normalized);
    });
    
    if (fallbackMatch) {
        return `filter-logo-assets/${fallbackMatch[1]}`;
    }
    
    return null;
}

function createFilterTabElement(label, filterType, filterValue, options = {}) {
    const filterTab = document.createElement('button');
    filterTab.className = 'filter-tab';
    filterTab.dataset.filterType = filterType;
    filterTab.dataset.filterValue = filterValue;
    
    const { colorHex = null } = options;
    
    if (filterType === 'color') {
        filterTab.classList.add('filter-tab-color');
        if (colorHex) {
            filterTab.dataset.colorHex = colorHex;
        }
        
        const swatch = document.createElement('span');
        swatch.className = 'filter-color-swatch';
        if (colorHex) {
            swatch.style.background = colorHex;
        }
        filterTab.appendChild(swatch);
    } else {
        const logoPath = getFilterLogoPath(label);
        if (logoPath) {
            const logoContainer = document.createElement('span');
            logoContainer.className = 'filter-logo-container';
            
            const logoImg = document.createElement('img');
            logoImg.className = 'filter-logo';
            const logoParts = logoPath.split('/');
            logoImg.src = logoParts.map(part => encodeURIComponent(part)).join('/');
            logoImg.alt = '';
            logoImg.decoding = 'async';
            logoImg.loading = 'lazy';
            
            logoContainer.appendChild(logoImg);
            filterTab.appendChild(logoContainer);
        }
    }
    
    const labelSpan = document.createElement('span');
    labelSpan.className = 'filter-label';
    labelSpan.textContent = label;
    filterTab.appendChild(labelSpan);
    
    filterTab.addEventListener('click', () => handleFilterClick(filterTab, filterType, filterValue));
    
    return filterTab;
}

function renderColorGradient(colors = []) {
    colorGradientFamilies = Array.isArray(colors) ? colors : [];
    
    if (!colorGradientContainer || !colorGradientBar) {
        initializeColorGradientBar();
        if (!colorGradientContainer || !colorGradientBar) {
            return;
        }
    }
    
    if (!colorGradientFamilies.length) {
        colorGradientBar.style.background = '';
        colorGradientContainer.classList.remove('visible', 'has-selection');
        colorGradientContainer.setAttribute('aria-hidden', 'true');
        clearGradientSelectionIndicator();
        return;
    }
    
    const gradientStops = colorGradientFamilies.map((color, index) => {
        const hex = color.sampleHex || '#000000';
        if (colorGradientFamilies.length === 1) {
            return `${hex} 0%, ${hex} 100%`;
        }
        const percent = (index / (colorGradientFamilies.length - 1)) * 100;
        return `${hex} ${percent}%`;
    }).join(', ');
    
    colorGradientBar.style.background = `linear-gradient(90deg, ${gradientStops})`;
    colorGradientContainer.classList.add('visible');
    colorGradientContainer.setAttribute('aria-hidden', 'false');
    
    if (activeFilter && activeFilter.filterType === 'color') {
        const colorIndex = colorGradientFamilies.findIndex(item => item.family === activeFilter.filterValue);
        if (colorIndex >= 0) {
            highlightGradientSelection(colorIndex);
            return;
        }
    }
    
    if (colorGradientActiveIndex !== null && colorGradientActiveIndex < colorGradientFamilies.length) {
        highlightGradientSelection(colorGradientActiveIndex);
    } else {
        clearGradientSelectionIndicator();
    }
}

function initializeColorGradientBar() {
    colorGradientContainer = document.getElementById('colorGradientContainer');
    colorGradientBar = document.getElementById('colorGradientBar');
    colorGradientIndicator = document.getElementById('colorGradientIndicator');
    
    if (!colorGradientContainer || !colorGradientBar || !colorGradientIndicator) {
        return;
    }
    
    const handleSelectionFromClientX = (clientX, isDrag = false) => {
        if (!colorGradientFamilies.length) return;
        const rect = colorGradientBar.getBoundingClientRect();
        if (rect.width === 0) return;
        const relativeX = (clientX - rect.left) / rect.width;
        const clamped = Math.max(0, Math.min(0.999999, relativeX));
        const index = Math.floor(clamped * colorGradientFamilies.length);
        
        // Both click and drag: just scroll to section (no filtering)
        highlightGradientSelection(index);
        scrollToColorSection(colorGradientFamilies[index].family);
    };
    
    // Click handler
    colorGradientBar.addEventListener('click', (event) => {
        if (!isDraggingGradient) {
            handleSelectionFromClientX(event.clientX, false);
        }
    });
    
    // Mouse drag handlers
    colorGradientBar.addEventListener('mousedown', (event) => {
        isDraggingGradient = true;
        gradientDragStartX = event.clientX;
        const canvasContainer = document.getElementById('canvasContainer');
        if (canvasContainer) {
            gradientDragStartScrollTop = canvasContainer.scrollTop;
        }
        handleSelectionFromClientX(event.clientX, true);
        event.preventDefault();
    });
    
    document.addEventListener('mousemove', (event) => {
        if (isDraggingGradient && colorGradientBar) {
            handleSelectionFromClientX(event.clientX, true);
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (isDraggingGradient) {
            isDraggingGradient = false;
        }
    });
    
    // Touch handlers
    colorGradientBar.addEventListener('touchstart', (event) => {
        if (event.touches && event.touches.length > 0) {
            isDraggingGradient = true;
            gradientDragStartX = event.touches[0].clientX;
            const canvasContainer = document.getElementById('canvasContainer');
            if (canvasContainer) {
                gradientDragStartScrollTop = canvasContainer.scrollTop;
            }
            handleSelectionFromClientX(event.touches[0].clientX, true);
        }
    }, { passive: false });
    
    colorGradientBar.addEventListener('touchmove', (event) => {
        if (isDraggingGradient && event.touches && event.touches.length > 0) {
            handleSelectionFromClientX(event.touches[0].clientX, true);
            event.preventDefault();
        }
    }, { passive: false });
    
    colorGradientBar.addEventListener('touchend', (event) => {
        if (isDraggingGradient && event.changedTouches && event.changedTouches.length > 0) {
            // Only select if it was a tap (not a drag)
            const dragDistance = Math.abs(event.changedTouches[0].clientX - gradientDragStartX);
            if (dragDistance < 10) {
                handleSelectionFromClientX(event.changedTouches[0].clientX, false);
            }
            isDraggingGradient = false;
        }
    }, { passive: true });
}

function highlightGradientSelection(index) {
    if (!colorGradientIndicator || !colorGradientContainer || !colorGradientFamilies.length) return;
    
    const clampedIndex = Math.max(0, Math.min(colorGradientFamilies.length - 1, index));
    colorGradientActiveIndex = clampedIndex;
    
    const percent = ((clampedIndex + 0.5) / colorGradientFamilies.length) * 100;
    colorGradientIndicator.style.left = `${percent}%`;
    
    const sampleHex = colorGradientFamilies[clampedIndex]?.sampleHex || '#FFFFFF';
    colorGradientIndicator.style.background = sampleHex;
    
    colorGradientContainer.classList.add('has-selection');
}

function clearGradientSelectionIndicator() {
    colorGradientActiveIndex = null;
    if (colorGradientIndicator) {
        colorGradientIndicator.style.left = '50%';
        colorGradientIndicator.style.background = '#FFFFFF';
    }
    if (colorGradientContainer) {
        colorGradientContainer.classList.remove('has-selection');
    }
}

function selectColorGradientIndex(index, triggeredByUser = false) {
    if (!colorGradientFamilies.length) return;
    
    const clampedIndex = Math.max(0, Math.min(colorGradientFamilies.length - 1, index));
    const selectedColor = colorGradientFamilies[clampedIndex];
    if (!selectedColor) return;
    
    if (triggeredByUser &&
        activeFilter &&
        activeFilter.filterType === 'color' &&
        activeFilter.filterValue === selectedColor.family &&
        activeFilter.source === 'gradient') {
        removeActiveFilter();
        return;
    }
    
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    activeFilter = {
        filterTab: null,
        filterType: 'color',
        filterValue: selectedColor.family,
        source: 'gradient'
    };
    
    highlightGradientSelection(clampedIndex);
    
    // Apply filter and scroll to section
    applyFilter('color', selectedColor.family, true);
}

// Handle filter click
function handleFilterClick(filterTab, filterType, filterValue) {
    // If clicking the same active filter, remove it
    if (activeFilter && activeFilter.filterTab === filterTab) {
        removeActiveFilter();
        return;
    }
    
    // Remove active state from all filters
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    if (filterType === 'color') {
        const colorIndex = colorGradientFamilies.findIndex(item => item.family === filterValue);
        if (colorIndex >= 0) {
            highlightGradientSelection(colorIndex);
        }
    } else {
        clearGradientSelectionIndicator();
    }
    
    // Set new active filter
    activeFilter = { filterTab, filterType, filterValue, source: 'tab' };
    filterTab.classList.add('active');
    
    // Apply filter with fade transition
    applyFilter(filterType, filterValue);
}

// Remove active filter
function removeActiveFilter() {
    if (!activeFilter) return;
    
    if (activeFilter.filterTab) {
        activeFilter.filterTab.classList.remove('active');
    }
    if (activeFilter.filterType === 'color') {
        clearGradientSelectionIndicator();
    }
    activeFilter = null;
    
    // Show all cards
    applyFilter(null, null);
}

// Filter grid by AI recommendations
function filterGridByAI(recommendedCardNames, query) {
    console.log(`AI recommended ${recommendedCardNames.length} cards for query: "${query}"`);
    
    // Filter card data to only show recommended cards
    const filteredData = cardData.filter(card => 
        recommendedCardNames.includes(card['Card Name'])
    );
    
    if (filteredData.length === 0) {
        console.warn('No cards matched the recommendations');
        return;
    }
    
    // Use the existing filter logic to remake the grid
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    
    // Clear active filter state
    activeFilter = null;
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    clearGradientSelectionIndicator();
    
    // Fade out existing cards
    allImageItems.forEach(item => {
        item.classList.remove('fade-in');
        item.classList.add('fade-out');
    });
    
    // After fade out, recreate grid with filtered data
    setTimeout(() => {
        canvas.innerHTML = '';
        allImageItems = [];
        
        const isMobile = window.innerWidth <= 768;
        const canvasContainer = document.getElementById('canvasContainer');
        
        if (isMobile) {
            if (mobileScrollMode === 'horizontal') {
                // Horizontal layout
                canvas.classList.add('horizontal-scroll');
                canvasContainer?.classList.add('horizontal-scroll-mode');
                canvas.style.width = 'auto';
                canvas.style.height = '100%';
                
                for (let i = 0; i < filteredData.length; i++) {
                    const card = filteredData[i];
                    const imagePath = getImagePathForCard(card['Card Name']);
                    if (!imagePath) {
                        console.warn(`No image found for filtered card "${card['Card Name']}", skipping.`);
                        continue;
                    }
                    const imageItem = createImageItem(imagePath, card, i, 0);
                    imageItem.dataset.cardIndex = i;
                    imageItem.classList.add('portrait-card');
                    imageItem.classList.remove('visible');
                    imageItem.style.opacity = '0';
                    canvas.appendChild(imageItem);
                    allImageItems.push(imageItem);
                    
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            imageItem.classList.add('fade-in');
                            imageItem.style.removeProperty('opacity');
                        });
                    });
                }
                
                if (canvasContainer) {
                    canvasContainer.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
                }
            } else {
                // Vertical layout
                canvas.classList.remove('horizontal-scroll');
                canvasContainer?.classList.remove('horizontal-scroll-mode');
                canvas.style.width = '100%';
                canvas.style.height = 'auto';
                
                for (let i = 0; i < filteredData.length; i++) {
                    const card = filteredData[i];
                    const imagePath = getImagePathForCard(card['Card Name']);
                    if (!imagePath) {
                        console.warn(`No image found for filtered card "${card['Card Name']}", skipping.`);
                        continue;
                    }
                    const imageItem = createImageItem(imagePath, card, 0, i);
                    imageItem.dataset.cardIndex = i;
                    imageItem.classList.remove('portrait-card');
                    imageItem.classList.remove('visible');
                    imageItem.style.opacity = '0';
                    canvas.appendChild(imageItem);
                    allImageItems.push(imageItem);
                    
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            imageItem.classList.add('fade-in');
                            imageItem.style.removeProperty('opacity');
                        });
                    });
                }
                
                if (canvasContainer) {
                    canvasContainer.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        } else {
            const totalCards = filteredData.length;
            // Calculate square grid for filtered data
            const filteredGridSize = Math.ceil(Math.sqrt(totalCards));
            const CARD_TOTAL_HEIGHT = 200;
            const totalWidth = filteredGridSize * (IMAGE_WIDTH + GAP) + GAP;
            const totalHeight = filteredGridSize * (CARD_TOTAL_HEIGHT + GAP) + GAP;
            
            console.log(`Creating ${filteredGridSize}×${filteredGridSize} square grid for ${totalCards} filtered cards`);
            
            // Set grid template columns dynamically
            canvas.style.gridTemplateColumns = `repeat(${filteredGridSize}, ${IMAGE_WIDTH}px)`;
            
            canvas.style.width = `${totalWidth}px`;
            canvas.style.minHeight = `${totalHeight}px`;
            canvas.style.height = 'auto';
            
            let cardIndex = 0;
            for (let row = 0; row < filteredGridSize && cardIndex < filteredData.length; row++) {
                for (let col = 0; col < filteredGridSize && cardIndex < filteredData.length; col++) {
                    const card = filteredData[cardIndex];
                    const imagePath = getImagePathForCard(card['Card Name']);
                    if (!imagePath) {
                        console.warn(`No image found for filtered card "${card['Card Name']}", skipping.`);
                        cardIndex++;
                        continue;
                    }
                    const imageItem = createImageItem(imagePath, card, row, col);
                    imageItem.classList.remove('visible');
                    imageItem.style.opacity = '0';
                    canvas.appendChild(imageItem);
                    allImageItems.push(imageItem);
                    
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            imageItem.classList.add('fade-in');
                            imageItem.style.removeProperty('opacity');
                        });
                    });
                    cardIndex++;
                }
            }
            
            if (canvasContainer) {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        const actualHeight = canvas.offsetHeight;
                        const actualWidth = canvas.offsetWidth;
                        const startX = (actualWidth - window.innerWidth) / 2;
                        const startY = (actualHeight - window.innerHeight) / 2;
                        canvasContainer.scrollTo({
                            left: Math.max(0, startX),
                            top: Math.max(0, startY),
                            behavior: 'smooth'
                        });
                    });
                });
            }
        }
        
        console.log(`Filtered to ${filteredData.length} AI-recommended cards`);
        
        // Re-apply mobile dynamic rotation after grid is remade
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                setupMobileDynamicRotation();
            }, 400);
        }
    }, 300);
}

// Apply filter with fade transition
function applyFilter(filterType, filterValue, scrollToSection = false) {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    
    // Step 1: Fade out all existing cards
    allImageItems.forEach(item => {
        item.classList.remove('fade-in');
        item.classList.add('fade-out');
    });
    
    // Step 2: After fade out, filter data and recreate grid
    setTimeout(() => {
        // Filter card data
        let filteredData = cardData;
        
        if (filterType && filterValue) {
            filteredData = cardData.filter(card => {
                if (filterType === 'network') {
                    return card['Network'] === filterValue;
                } else if (filterType === 'feeType') {
                    const annualFee = card['Annual Fee (INR)'];
                    const feeValue = typeof annualFee === 'string' ? parseInt(annualFee.replace(/,/g, '')) : annualFee;
                    const cardFeeType = (feeValue && feeValue > 0) ? 'Paid' : 'Free';
                    return cardFeeType === filterValue;
                } else if (filterType === 'bank') {
                    return card['Bank/Issuer'] === filterValue;
                } else if (filterType === 'color') {
                    if (!cardColorsByImage || Object.keys(cardColorsByImage).length === 0) return false;
                    const imageFileName = getImageFileNameForCard(card['Card Name']);
                    if (!imageFileName) return false;
                    const colorInfo = cardColorsByImage[imageFileName];
                    if (!colorInfo || !colorInfo.colorFamily) return false;
                    return colorInfo.colorFamily === filterValue;
                }
                return true;
            });
        }
        
        // Sort filtered data by color order if gradient is available
        if (colorGradientFamilies.length > 0) {
            filteredData = sortCardsByColorOrder(filteredData);
        }
        
        // Clear canvas
        canvas.innerHTML = '';
        allImageItems = [];
        
        // Recreate grid with filtered data
        const isMobile = window.innerWidth <= 768;
        const canvasContainer = document.getElementById('canvasContainer');
        
        if (isMobile) {
            // Mobile: Create layout based on scroll mode
            if (mobileScrollMode === 'horizontal') {
                // Horizontal layout
                canvas.classList.add('horizontal-scroll');
                canvasContainer?.classList.add('horizontal-scroll-mode');
                canvas.style.width = 'auto';
                canvas.style.height = '100%';
                
                for (let i = 0; i < filteredData.length; i++) {
                    const card = filteredData[i];
                    const imagePath = getImagePathForCard(card['Card Name']);
                    if (!imagePath) {
                        console.warn(`No image found for filtered card "${card['Card Name']}", skipping.`);
                        continue;
                    }
                    const imageItem = createImageItem(imagePath, card, i, 0);
                    imageItem.dataset.cardIndex = i;
                    imageItem.classList.add('portrait-card');
                    imageItem.classList.remove('visible');
                    imageItem.style.opacity = '0';
                    canvas.appendChild(imageItem);
                    allImageItems.push(imageItem);
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            imageItem.classList.add('fade-in');
                            imageItem.style.removeProperty('opacity');
                        });
                    });
                }
                
                // Scroll to left
                if (canvasContainer) {
                    canvasContainer.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
                }
            } else {
                // Vertical layout (existing behavior)
                canvas.classList.remove('horizontal-scroll');
                canvasContainer?.classList.remove('horizontal-scroll-mode');
                canvas.style.width = '100%';
                canvas.style.height = 'auto';
                
                for (let i = 0; i < filteredData.length; i++) {
                    const card = filteredData[i];
                    const imagePath = getImagePathForCard(card['Card Name']);
                    if (!imagePath) {
                        console.warn(`No image found for filtered card "${card['Card Name']}", skipping.`);
                        continue;
                    }
                    const imageItem = createImageItem(imagePath, card, 0, i);
                    imageItem.dataset.cardIndex = i;
                    imageItem.classList.remove('portrait-card');
                    imageItem.classList.remove('visible');
                    imageItem.style.opacity = '0';
                    canvas.appendChild(imageItem);
                    allImageItems.push(imageItem);
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            imageItem.classList.add('fade-in');
                            imageItem.style.removeProperty('opacity');
                        });
                    });
                }
                
                // Scroll to section if requested, otherwise scroll to top
                if (canvasContainer) {
                    if (scrollToSection && filterType === 'color' && filterValue) {
                        setTimeout(() => {
                            scrollToColorSection(filterValue);
                        }, 100);
                    } else {
                        canvasContainer.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }
            }
        } else {
            // Desktop: Calculate square grid dimensions based on filtered data
            const totalFilteredCards = filteredData.length;
            const filteredGridSize = Math.ceil(Math.sqrt(totalFilteredCards));
            
            // Calculate actual dimensions needed
            // Card height includes: image (158px) + card name (9+16=25px) + network (5+11=16px) = ~200px
            const CARD_TOTAL_HEIGHT = 200;
            const totalWidth = filteredGridSize * (IMAGE_WIDTH + GAP) + GAP;
            const totalHeight = filteredGridSize * (CARD_TOTAL_HEIGHT + GAP) + GAP;
            
            console.log(`Creating ${filteredGridSize}×${filteredGridSize} square grid for ${totalFilteredCards} AI-filtered cards`);
            
            // Set grid template columns dynamically
            canvas.style.gridTemplateColumns = `repeat(${filteredGridSize}, ${IMAGE_WIDTH}px)`;
            
            // Set canvas size - use min-height to allow grid to grow with content
            canvas.style.width = `${totalWidth}px`;
            canvas.style.minHeight = `${totalHeight}px`;
            canvas.style.height = 'auto';
            
            // Desktop: Create square grid based on filtered data
            let cardIndex = 0;
            for (let row = 0; row < filteredGridSize && cardIndex < filteredData.length; row++) {
                for (let col = 0; col < filteredGridSize && cardIndex < filteredData.length; col++) {
                    const card = filteredData[cardIndex];
                    const imagePath = getImagePathForCard(card['Card Name']);
                    if (!imagePath) {
                        console.warn(`No image found for filtered card "${card['Card Name']}", skipping.`);
                        cardIndex++;
                        continue;
                    }
                    const imageItem = createImageItem(imagePath, card, row, col);
                    // Remove initial fadeIn animation, start with opacity 0
                    imageItem.classList.remove('visible');
                    imageItem.style.opacity = '0';
                    canvas.appendChild(imageItem);
                    allImageItems.push(imageItem);
                    // Trigger fade in using requestAnimationFrame
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            imageItem.classList.add('fade-in');
                            imageItem.style.removeProperty('opacity');
                        });
                    });
                    cardIndex++;
                }
            }
            
            // Scroll to section if requested, otherwise scroll to center
            if (canvasContainer) {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        if (scrollToSection && filterType === 'color' && filterValue) {
                            setTimeout(() => {
                                scrollToColorSection(filterValue);
                            }, 100);
                        } else {
                            const actualHeight = canvas.offsetHeight;
                            const actualWidth = canvas.offsetWidth;
                            const startX = (actualWidth - window.innerWidth) / 2;
                            const startY = (actualHeight - window.innerHeight) / 2;
                            canvasContainer.scrollTo({
                                left: Math.max(0, startX),
                                top: Math.max(0, startY),
                                behavior: 'smooth'
                            });
                        }
                    });
                });
            }
        }
        
        console.log(`Filtered to ${filteredData.length} cards`);
        
        // Re-apply mobile dynamic rotation after grid is remade
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                setupMobileDynamicRotation();
            }, 400);
        }
    }, 300); // Wait for fade out to complete
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCanvas);
} else {
    initCanvas();
}

// ============================================
// AI RECOMMENDATION SEARCH FUNCTIONALITY
// ============================================

let searchTimeout = null;
let currentController = null; // For aborting pending requests

// Initialize search bar
function initSearchBar() {
    const searchBar = document.getElementById('searchBar');
    const searchBarContainer = document.getElementById('searchBarContainer');
    const searchCloseButton = document.getElementById('searchCloseButton');
    
    if (!searchBar || !searchBarContainer) return;
    
    // Check if mobile device
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Handle click on search bar to expand to fullscreen (mobile only)
    searchBar.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isMobile() && !searchBarContainer.classList.contains('fullscreen')) {
            searchBarContainer.classList.add('fullscreen');
            searchBar.focus();
        }
    });
    
    // Handle close button click (mobile only)
    if (searchCloseButton) {
        searchCloseButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isMobile()) {
                searchBarContainer.classList.remove('fullscreen');
                searchBar.blur();
            }
        });
    }
    
    // Handle search input
    searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchBar.value.trim();
            if (query.length > 0) {
                handleSearch(query);
            }
        }
    });
    
    // Close on Escape key (mobile only)
    searchBar.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMobile() && searchBarContainer.classList.contains('fullscreen')) {
            searchBarContainer.classList.remove('fullscreen');
            searchBar.blur();
        }
    });
    
    // Handle window resize - remove fullscreen if switching to desktop
    window.addEventListener('resize', () => {
        if (!isMobile() && searchBarContainer.classList.contains('fullscreen')) {
            searchBarContainer.classList.remove('fullscreen');
            searchBar.blur();
        }
    });
}

// Handle search query
async function handleSearch(query) {
    console.log(`Searching for: "${query}"`);
    
    // Abort any pending request
    if (currentController) {
        currentController.abort();
    }
    currentController = new AbortController();
    
    // Show loading state in search bar
    const searchBar = document.getElementById('searchBar');
    const originalPlaceholder = searchBar.placeholder;
    searchBar.placeholder = `Analyzing ${renderedCards.length} cards...`;
    searchBar.disabled = true;
    
    try {
        const response = await fetch('/api/recommend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                query,
                cardData: renderedCards  // Send only rendered cards (those with images)
            }),
            signal: currentController.signal,
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `HTTP error! status: ${response.status}`, { 
                cause: error.details 
            });
        }
        
        const data = await response.json();
        
        // Filter grid to show only recommended cards
        filterGridByAI(data.recommendedCardNames, query);
        
        // Clear search bar
        searchBar.value = '';
        
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Request was cancelled');
            return;
        }
        
        console.error('Search error:', error);
        const details = error.cause || error.details || '';
        showError(error.message, details);
    } finally {
        currentController = null;
        searchBar.disabled = false;
        searchBar.placeholder = originalPlaceholder;
    }
}

// Show error message (simple alert for now)
function showError(message, details = '') {
    let errorMsg = `Unable to get recommendations:\n\n${message}`;
    if (details) {
        errorMsg += `\n\nDetails: ${details}`;
    }
    alert(errorMsg);
}

// Initialize search on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchBar);
} else {
    initSearchBar();
}

// ============================================
// MOBILE CARD DETAIL VIEW
// ============================================

function initializeCardDetailView() {
    if (cardDetailInitialized) return;
    
    detailOverlay = document.getElementById('cardDetailOverlay');
    detailCard = document.getElementById('cardDetailCard');
    detailImage = document.getElementById('cardDetailImage');
    detailContent = document.getElementById('cardDetailContent');
    detailCloseButton = document.getElementById('cardDetailClose');
    
    if (!detailOverlay || !detailCard || !detailContent) {
        return;
    }
    
    cardDetailInitialized = true;
    
    if (detailCloseButton) {
        detailCloseButton.addEventListener('click', hideCardDetail);
    }
    
    detailOverlay.addEventListener('click', (event) => {
        if (event.target === detailOverlay) {
            hideCardDetail();
        }
    });
    
    detailCard.addEventListener('transitionend', (event) => {
        if (event.propertyName !== 'transform') return;
        if (!activeCardDetail && detailOverlay) {
            detailOverlay.classList.remove('active');
            detailCard.style.width = '';
            detailCard.style.height = '';
            detailCard.style.transform = '';
            detailCard.style.borderRadius = '';
            detailCard.classList.remove('active');
            detailContent.innerHTML = '';
            document.body.classList.remove('detail-open');
            if (detailImage) {
                detailImage.removeAttribute('src');
            }
        }
    });
}

function showCardDetail(card, imageItem) {
    if (!isMobileViewport()) return;
    initializeCardDetailView();
    
    if (!detailOverlay || !detailCard || !detailContent || !detailImage) return;
    if (activeCardDetail) return; // Prevent multiple openings
    
    const imageContainer = imageItem.querySelector('.image-container');
    if (imageContainer) {
        imageContainer.style.transform = 'rotateX(0deg)';
    }
    
    const rect = imageItem.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const startX = rect.left;
    const startY = rect.top + scrollY;
    
    detailOverlay.classList.add('active');
    document.body.classList.add('detail-open');
    
    detailCard.style.width = `${rect.width}px`;
    detailCard.style.height = `${rect.height}px`;
    detailCard.style.transform = `translate(${startX}px, ${startY}px)`;
    const initialRadius = window.getComputedStyle(imageItem).borderRadius || '12px';
    detailCard.style.borderRadius = initialRadius;
    
    detailImage.alt = card['Card Name'] || 'Selected card';
    const imagePath = getImagePathForCard(card['Card Name']);
    if (imagePath) {
        const pathParts = imagePath.split('/');
        detailImage.src = pathParts.map(part => encodeURIComponent(part)).join('/');
    } else {
        detailImage.removeAttribute('src');
    }
    
    detailContent.innerHTML = renderCardDetailSkeleton();
    
    imageItem.classList.add('card-hidden');
    
    activeCardDetail = {
        card,
        imageItem
    };
    
    requestAnimationFrame(() => {
        detailCard.style.transform = 'translate(0px, 0px)';
        detailCard.style.width = '100vw';
        detailCard.style.height = '100vh';
        detailCard.style.borderRadius = '0px';
        detailCard.classList.add('active');
    });
    
    requestCardDetails(card);
}

function hideCardDetail() {
    if (!activeCardDetail || !detailCard || !detailOverlay) return;
    
    if (cardDetailAbortController) {
        cardDetailAbortController.abort();
        cardDetailAbortController = null;
    }
    
    const { imageItem } = activeCardDetail;
    if (imageItem) {
        const rect = imageItem.getBoundingClientRect();
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        detailCard.classList.remove('active');
        detailCard.style.transform = `translate(${rect.left}px, ${rect.top + scrollY}px)`;
        detailCard.style.width = `${rect.width}px`;
        detailCard.style.height = `${rect.height}px`;
        const radius = window.getComputedStyle(imageItem).borderRadius || '12px';
        detailCard.style.borderRadius = radius;
        
        setTimeout(() => {
            imageItem.classList.remove('card-hidden');
            activeCardDetail = null;
        }, 260);
    } else {
        detailCard.classList.remove('active');
        detailOverlay.classList.remove('active');
        detailContent.innerHTML = '';
        document.body.classList.remove('detail-open');
        activeCardDetail = null;
    }
}

function requestCardDetails(card) {
    if (!card) return;
    
    if (cardDetailAbortController) {
        cardDetailAbortController.abort();
    }
    cardDetailAbortController = new AbortController();
    
    fetchCardDetails(card, cardDetailAbortController.signal)
        .then((data) => {
            if (!activeCardDetail) return;
            cardDetailAbortController = null;
            renderCardDetailContent(data);
        })
        .catch((error) => {
            if (error.name === 'AbortError') return;
            cardDetailAbortController = null;
            renderCardDetailError(error);
        });
}

function fetchCardDetails(card, signal) {
    return fetch('/api/card-details', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ card }),
        signal
    }).then(async (response) => {
        if (!response.ok) {
            let errorDetails = '';
            try {
                const err = await response.json();
                errorDetails = err.error || response.statusText;
            } catch (parseError) {
                errorDetails = response.statusText;
            }
            throw new Error(errorDetails || 'Failed to fetch card details');
        }
        
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch (parseError) {
            console.error('Failed to parse AI response:', text);
            throw new Error('Unable to parse AI response');
        }
    });
}

function renderCardDetailSkeleton() {
    return `
        <div class="card-detail-skeleton">
            <div class="card-detail-skeleton-block medium"></div>
            <div class="card-detail-skeleton-block short"></div>
            <div class="card-detail-skeleton-block full"></div>
            <div class="card-detail-skeleton-block medium"></div>
            <div class="card-detail-skeleton-block full"></div>
            <div class="card-detail-skeleton-block medium"></div>
        </div>
    `;
}

function renderCardDetailError(error) {
    if (!detailContent) return;
    const message = typeof error === 'string' ? error : (error.message || 'Unable to load card details');
    detailContent.innerHTML = `
        <div class="card-detail-error">
            <p>${message}</p>
            <button type="button" class="card-detail-retry" id="cardDetailRetryButton">Retry</button>
        </div>
    `;
    
    const retryButton = document.getElementById('cardDetailRetryButton');
    if (retryButton && activeCardDetail) {
        retryButton.addEventListener('click', () => {
            detailContent.innerHTML = renderCardDetailSkeleton();
            requestCardDetails(activeCardDetail.card);
        }, { once: true });
    }
}

function renderCardDetailContent(data) {
    if (!detailContent) return;
    
    if (!data || typeof data !== 'object') {
        detailContent.innerHTML = `
            <div class="card-detail-error">
                <p>We couldn't find detailed information for this card.</p>
            </div>
        `;
        return;
    }
    
    const entries = [];
    
    const addEntry = (label, value, options = {}) => {
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
    };
    
    const summary = data.summary || {};
    const summaryTags = Array.isArray(summary.ideal_user_profiles)
        ? summary.ideal_user_profiles.filter(Boolean).map(tag => `<span class="card-detail-badge">${escapeHtml(tag)}</span>`)
        : [];
    const summaryParts = [];
    if (summary.positioning) {
        summaryParts.push(`<div>${escapeHtml(summary.positioning)}</div>`);
    }
    if (summaryTags.length) {
        summaryParts.push(`<div class="card-detail-badge-list">${summaryTags.join('')}</div>`);
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
        const html = `
            <ul>
                ${lateFees.map(item => `
                    <li>${escapeHtml(item.slab)}: ${escapeHtml(item.fee)}</li>
                `).join('')}
            </ul>
        `;
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
        const html = `
            <ul>
                ${multipliers.map(item => {
                    const parts = [
                        `${escapeHtml(item.category)}: ${escapeHtml(item.earn_rate)}`
                    ];
                    if (item.monthly_cap) {
                        parts.push(`Cap: ${escapeHtml(item.monthly_cap)}`);
                    }
                    if (item.exclusions) {
                        parts.push(`Exclusions: ${escapeHtml(item.exclusions)}`);
                    }
                    return `<li>${parts.join(' • ')}</li>`;
                }).join('')}
            </ul>
        `;
        addEntry('Category Multipliers', html, { allowHtml: true });
    }
    
    const redemption = rewards.reward_redemption || {};
    const redemptionItems = [
        redemption.catalog_value ? `Catalog: ${escapeHtml(redemption.catalog_value)}` : null,
        redemption.air_miles_transfer ? `Air Miles: ${escapeHtml(redemption.air_miles_transfer)}` : null,
        redemption.statement_credit ? `Statement Credit: ${escapeHtml(redemption.statement_credit)}` : null,
        redemption.expiry_policy ? `Expiry: ${escapeHtml(redemption.expiry_policy)}` : null
    ].filter(Boolean);
    if (redemptionItems.length) {
        addEntry('Reward Redemption', formatBulletList(redemptionItems), { allowHtml: true });
    }
    
    const welcomeData = data.welcome_and_milestone_benefits || {};
    const welcome = welcomeData.welcome_benefit || {};
    if (welcome.description || welcome.fulfilment_timeline || welcome.eligibility_condition) {
        const parts = [];
        if (welcome.description) {
            parts.push(`<div>${escapeHtml(welcome.description)}</div>`);
        }
        if (welcome.fulfilment_timeline) {
            parts.push(`<div>Fulfilment: ${escapeHtml(welcome.fulfilment_timeline)}</div>`);
        }
        if (welcome.eligibility_condition) {
            parts.push(`<div>Condition: ${escapeHtml(welcome.eligibility_condition)}</div>`);
        }
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
        const html = `
            <ul>
                ${milestones.map(item => {
                    const parts = [`${escapeHtml(item.spend_threshold)}: ${escapeHtml(item.reward)}`];
                    if (item.notes) {
                        parts.push(escapeHtml(item.notes));
                    }
                    return `<li>${parts.join(' • ')}</li>`;
                }).join('')}
            </ul>
        `;
        addEntry('Milestone Benefits', html, { allowHtml: true });
    }
    
    const travel = data.travel_and_lounge || {};
    const domestic = travel.domestic_lounge_access || {};
    const international = travel.international_lounge_access || {};
    
    const domesticParts = [];
    if (domestic.visits_per_year) domesticParts.push(`Visits: ${escapeHtml(domestic.visits_per_year)}`);
    if (domestic.program) domesticParts.push(`Program: ${escapeHtml(domestic.program)}`);
    if (domestic.guest_policy) domesticParts.push(`Guests: ${escapeHtml(domestic.guest_policy)}`);
    if (domesticParts.length) {
        addEntry('Domestic Lounge Access', domesticParts.join(' • '), { allowHtml: true });
    }
    
    const internationalParts = [];
    if (international.free_visits) internationalParts.push(`Visits: ${escapeHtml(international.free_visits)}`);
    if (international.program) internationalParts.push(`Program: ${escapeHtml(international.program)}`);
    if (international.guest_policy) internationalParts.push(`Guests: ${escapeHtml(international.guest_policy)}`);
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
        const html = `
            <ul>
                ${travelInsurance.map(item => {
                    const parts = [`${escapeHtml(item.cover_type)}: ${escapeHtml(item.coverage_amount)}`];
                    if (item.conditions) {
                        parts.push(escapeHtml(item.conditions));
                    }
                    return `<li>${parts.join(' • ')}</li>`;
                }).join('')}
            </ul>
        `;
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
        const html = `
            <ul>
                ${promotions.map(item => {
                    const parts = [];
                    if (item.offer_name) parts.push(`${escapeHtml(item.offer_name)}`);
                    if (item.valid_till) parts.push(`Valid till ${escapeHtml(item.valid_till)}`);
                    if (item.offer_details) parts.push(`<div>${escapeHtml(item.offer_details)}</div>`);
                    return `<li>${parts.join(' • ')}</li>`;
                }).join('')}
            </ul>
        `;
        addEntry('Promotions', html, { allowHtml: true });
    }
    
    if (entries.length === 0) {
        detailContent.innerHTML = `
            <div class="card-detail-error">
                <p>Detailed information for this card is not available right now.</p>
            </div>
        `;
        return;
    }
    
    const rowsHtml = entries.map(entry => `
        <div class="card-detail-key">${entry.label}</div>
        <div class="card-detail-value">${entry.value}</div>
    `).join('');
    
    const cardTitle = escapeHtml(data.card_name || detailImage?.alt || 'Card Details');
    
    detailContent.innerHTML = `
        <section class="card-detail-section card-detail-section-single">
            <h3>${cardTitle}</h3>
            <div class="card-detail-key-value">
                ${rowsHtml}
            </div>
        </section>
    `;
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
        .map(item => `<li>${escapeHtml(item)}</li>`)
        .join('');
    if (!bullets) return '';
    return `<ul>${bullets}</ul>`;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCardDetailView);
} else {
    initializeCardDetailView();
}

// ============================================
// MOBILE DYNAMIC ROTATION BASED ON SCROLL
// ============================================

let mobileRotationScrollHandler = null;
let mobileRotationResizeHandler = null;

function setupMobileDynamicRotation() {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;
    
    const canvasContainer = document.getElementById('canvasContainer');
    if (!canvasContainer) return;
    
    // Remove previous listeners if any
    if (mobileRotationScrollHandler) {
        canvasContainer.removeEventListener('scroll', mobileRotationScrollHandler);
    }
    if (mobileRotationResizeHandler) {
        window.removeEventListener('resize', mobileRotationResizeHandler);
    }
    
    let ticking = false;
    
    function updateCardRotations() {
        const imageItems = document.querySelectorAll('.image-item');
        
        if (mobileScrollMode === 'horizontal') {
            // Horizontal scroll: Y-axis rotation (-40deg to +25deg)
            const viewportWidth = window.innerWidth;
            
            imageItems.forEach(item => {
                const imageContainer = item.querySelector('.image-container');
                if (!imageContainer) return;
                
                const rect = item.getBoundingClientRect();
                const cardLeft = rect.left;
                const cardRight = rect.right;
                const cardCenter = cardLeft + (rect.width / 2);
                
                // Only apply rotation if card is in viewport or near it
                if (cardRight > -100 && cardLeft < viewportWidth + 100) {
                    // Calculate normalized position (0 = left, 1 = right)
                    // Right side of viewport = -40deg, left side = +25deg
                    const normalizedPosition = Math.max(0, Math.min(1, cardCenter / viewportWidth));
                    
                    // Interpolate rotation: right (-40deg) to left (+25deg)
                    const rotation = -40 + (65 * normalizedPosition);
                    
                    // Apply Y-axis rotation
                    imageContainer.style.transform = `rotateY(${rotation}deg)`;
                }
            });
        } else {
            // Vertical scroll: X-axis rotation (+23deg to -90deg)
            const viewportHeight = window.innerHeight;
            
            imageItems.forEach(item => {
                const imageContainer = item.querySelector('.image-container');
                if (!imageContainer) return;
                
                const rect = item.getBoundingClientRect();
                const cardTop = rect.top;
                const cardBottom = rect.bottom;
                const cardCenter = cardTop + (rect.height / 2);
                
                // Only apply rotation if card is in viewport or near it
                if (cardBottom > -100 && cardTop < viewportHeight + 100) {
                    // Calculate normalized position (0 = top, 1 = bottom)
                    const normalizedPosition = Math.max(0, Math.min(1, cardCenter / viewportHeight));
                    
                    // Interpolate rotation: top (+23deg) to bottom (-90deg)
                    const rotation = 23 - (113 * normalizedPosition);
                    
                    // Apply X-axis rotation
                    imageContainer.style.transform = `rotateX(${rotation}deg)`;
                }
            });
        }
        
        ticking = false;
    }
    
    mobileRotationScrollHandler = function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateCardRotations);
            ticking = true;
        }
    };
    
    mobileRotationResizeHandler = function onResize() {
        const isMobileNow = window.innerWidth <= 768;
        if (isMobileNow) {
            updateCardRotations();
        }
    };
    
    // Initial rotation calculation
    updateCardRotations();
    
    // Listen to scroll events
    canvasContainer.addEventListener('scroll', mobileRotationScrollHandler, { passive: true });
    
    // Recalculate on window resize
    window.addEventListener('resize', mobileRotationResizeHandler);
}

// Initialize mobile dynamic rotation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMobileDynamicRotation);
} else {
    setupMobileDynamicRotation();
}

// ============================================
// SCROLL-BASED HEADER COLLAPSE
// ============================================

function setupHeaderCollapse() {
    const canvasContainer = document.getElementById('canvasContainer');
    const filtersContainer = document.getElementById('filtersContainer');
    const siteTitle = document.querySelector('.site-title');
    
    if (!canvasContainer || !filtersContainer || !siteTitle) return;
    
    let lastScrollTop = 0;
    let ticking = false;
    const scrollThreshold = 10; // Minimum scroll distance to trigger
    
    function updateHeader() {
        const scrollTop = canvasContainer.scrollTop;
        const scrollDifference = scrollTop - lastScrollTop;
        
        // Only update if scroll difference is significant
        if (Math.abs(scrollDifference) > scrollThreshold) {
            if (scrollDifference > 0 && scrollTop > 50) {
                // Scrolling down - hide filters and collapse heading
                filtersContainer.classList.add('hidden');
                siteTitle.classList.add('collapsed');
            } else if (scrollDifference < 0) {
                // Scrolling up - show filters and expand heading
                filtersContainer.classList.remove('hidden');
                siteTitle.classList.remove('collapsed');
            }
            
            lastScrollTop = scrollTop;
        }
        
        ticking = false;
    }
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    canvasContainer.addEventListener('scroll', onScroll, { passive: true });
}

// Initialize header collapse
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupHeaderCollapse);
} else {
    setupHeaderCollapse();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeColorGradientBar);
} else {
    initializeColorGradientBar();
}


