// Version: 2025-01-15-v7 - Only render cards with exact image matches
// Card data will be loaded from data.txt
let cardData = []; // All cards from data.txt
let renderedCards = []; // Only cards with exact image matches (displayed in grid)

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

// Function to check if a card has an exact image match
function hasImageMatch(cardName) {
    if (!cardName) return false;
    
    // Try exact match first
    const exactMatch = availableCardImages.find(img => 
        img.replace('.png', '') === cardName
    );
    
    if (exactMatch) return true;
    
    // Try fuzzy match (case-insensitive, ignore extra spaces)
    const normalizedCardName = cardName.toLowerCase().trim().replace(/\s+/g, ' ');
    const fuzzyMatch = availableCardImages.find(img => {
        const normalizedImgName = img.replace('.png', '').toLowerCase().trim().replace(/\s+/g, ' ');
        return normalizedImgName === normalizedCardName;
    });
    
    return !!fuzzyMatch;
}

// Function to get image path for a card by matching name
function getImagePathForCard(cardName) {
    if (!cardName) return null;
    
    // Try exact match first
    const exactMatch = availableCardImages.find(img => 
        img.replace('.png', '') === cardName
    );
    
    if (exactMatch) {
        return `Assets/${exactMatch}`;
    }
    
    // Try fuzzy match (case-insensitive, ignore extra spaces)
    const normalizedCardName = cardName.toLowerCase().trim().replace(/\s+/g, ' ');
    const fuzzyMatch = availableCardImages.find(img => {
        const normalizedImgName = img.replace('.png', '').toLowerCase().trim().replace(/\s+/g, ' ');
        return normalizedImgName === normalizedCardName;
    });
    
    if (fuzzyMatch) {
        return `Assets/${fuzzyMatch}`;
    }
    
    // No match found - return null (card won't be rendered)
    return null;
}

// Grid configuration
const IMAGE_WIDTH = 257; // Width of each image in pixels
const IMAGE_HEIGHT = 158; // Height of each image in pixels
const GAP = 71; // Horizontal gap between images

// Grid size will be calculated dynamically to always be square
let GRID_SIZE = 20; // Will be updated based on card count (rows = cols)

// Card shuffle loading animation (desktop only)
function startShuffleAnimation() {
    return new Promise((resolve) => {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            // Skip animation on mobile
            resolve();
            return;
        }
        
        const overlay = document.getElementById('shuffleAnimationOverlay');
        const container = document.getElementById('shuffleContainer');
        
        // Pick 10 random images
        const shuffledImages = [...availableCardImages].sort(() => Math.random() - 0.5).slice(0, 10);
        const cards = [];
        
        // Create 10 card elements
        shuffledImages.forEach((imageName, index) => {
            const card = document.createElement('div');
            card.className = 'shuffle-card';
            
            const img = document.createElement('img');
            img.src = `Assets/${encodeURIComponent(imageName)}`;
            img.alt = imageName;
            
            card.appendChild(img);
            container.appendChild(card);
            cards.push(card);
            
            // Set initial position and z-index (stacked with 3px offset)
            card.style.transform = `translateY(${index * 3}px)`;
            card.style.zIndex = index;
        });
        
        let animationCount = 0;
        const totalDuration = 3000; // 3 seconds
        const intervalTime = 300; // 0.3 seconds
        const maxAnimations = Math.floor(totalDuration / intervalTime);
        
        // Animation loop
        const animationInterval = setInterval(() => {
            animationCount++;
            
            if (animationCount >= maxAnimations) {
                clearInterval(animationInterval);
                
                // Hide overlay after 4 seconds
                setTimeout(() => {
                    overlay.classList.add('hidden');
                    setTimeout(() => {
                        overlay.style.display = 'none';
                        resolve();
                    }, 500); // Wait for fade out
                }, 0);
                return;
            }
            
            // Get the back card (lowest z-index)
            let backCard = cards[0];
            let minZIndex = parseInt(backCard.style.zIndex);
            
            cards.forEach(card => {
                const zIndex = parseInt(card.style.zIndex);
                if (zIndex < minZIndex) {
                    minZIndex = zIndex;
                    backCard = card;
                }
            });
            
            // Lift the back card up by (height + 13px)
            const liftDistance = -(158 + 13); // negative to go up
            backCard.style.transform = `translateY(${liftDistance}px)`;
            
            // After the lift animation completes, move it to the front
            setTimeout(() => {
                // Find the current max z-index
                let maxZIndex = Math.max(...cards.map(c => parseInt(c.style.zIndex)));
                
                // Move to front (highest z-index + 1)
                backCard.style.zIndex = maxZIndex + 1;
                
                // Calculate new position (should be at top of stack with 3px offset)
                const newPosition = maxZIndex * 3;
                backCard.style.transform = `translateY(${newPosition}px)`;
            }, 150); // Half of the transition time for smooth effect
            
        }, intervalTime);
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

// Initialize canvas
async function initCanvas() {
    try {
        // Load card data first
        await loadCardData();
        
        // If no cards with images, show error
        if (renderedCards.length === 0) {
            console.error('No cards with images found.');
            const canvas = document.getElementById('canvas');
            canvas.innerHTML = '<div style="padding: 50px; text-align: center; color: #999;">No cards with images found. Please add credit card images to Assets folder.</div>';
            return;
        }
        
        // Start shuffle animation (desktop only, 4 seconds)
        await startShuffleAnimation();
        
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
    const totalCards = renderedCards.length || 0;
    
    console.log(`Creating grid with ${totalCards} cards with images`);
    
    if (totalCards === 0) {
        console.warn('No cards with images to render');
        return;
    }
    
    // Clear existing items
    allImageItems = [];
    
    if (isMobile) {
        // Mobile: Create vertical stack based on rendered cards
        for (let i = 0; i < totalCards; i++) {
            const card = renderedCards[i];
            // Get matched image for this card (guaranteed to exist)
            const imagePath = getImagePathForCard(card['Card Name']);
            
            // Debug first 5 matches
            if (i < 5) {
                console.log(`Card ${i}: "${card['Card Name']}" -> ${imagePath}`);
            }
            
            // Create image item with card data
            const imageItem = createImageItem(imagePath, card, 0, i);
            imageItem.dataset.cardIndex = i;
            canvas.appendChild(imageItem);
            allImageItems.push(imageItem);
        }
    } else {
        // Desktop: Create square grid based on rendered cards
        let cardIndex = 0;
        for (let row = 0; row < GRID_SIZE && cardIndex < totalCards; row++) {
            for (let col = 0; col < GRID_SIZE && cardIndex < totalCards; col++) {
                const card = renderedCards[cardIndex];
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
    
    // Create filters after cards are created
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
    
    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';
    
    // Create image (imagePath is always defined now)
    const img = document.createElement('img');
    const pathParts = imagePath.split('/');
    const encodedPath = pathParts.map(part => encodeURIComponent(part)).join('/');
    img.src = encodedPath;
    img.alt = card ? card['Card Name'] : imagePath.split('/').pop();
    img.loading = 'lazy';
    
    img.onload = () => {
        // On mobile, make visible immediately
        // On desktop, keep opacity 0 until ripple animation
        const isMobile = window.innerWidth <= 768;
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
    
    return imageItem;
}

// Filter functionality
let activeFilter = null;
let allImageItems = [];

// Extract unique filter values from card data
function extractFilterValues() {
    const networks = new Set();
    const banks = new Set();
    const feeTypes = new Set(['Paid', 'Free']);
    
    // Only extract values from cards that are actually rendered
    renderedCards.forEach(card => {
        if (card['Network']) networks.add(card['Network']);
        if (card['Bank/Issuer']) banks.add(card['Bank/Issuer']);
    });
    
    return {
        networks: Array.from(networks).sort(),
        banks: Array.from(banks).sort(),
        feeTypes: Array.from(feeTypes)
    };
}

// Create filter buttons
function createFilters() {
    const filtersScroll = document.getElementById('filtersScroll');
    if (!filtersScroll) return;
    
    const filterValues = extractFilterValues();
    
    // Clear existing filters
    filtersScroll.innerHTML = '';
    
    // Network filters
    filterValues.networks.forEach(network => {
        const filterTab = document.createElement('button');
        filterTab.className = 'filter-tab';
        filterTab.textContent = network;
        filterTab.dataset.filterType = 'network';
        filterTab.dataset.filterValue = network;
        filterTab.addEventListener('click', () => handleFilterClick(filterTab, 'network', network));
        filtersScroll.appendChild(filterTab);
    });
    
    // Fee type filters
    filterValues.feeTypes.forEach(feeType => {
        const filterTab = document.createElement('button');
        filterTab.className = 'filter-tab';
        filterTab.textContent = feeType;
        filterTab.dataset.filterType = 'feeType';
        filterTab.dataset.filterValue = feeType;
        filterTab.addEventListener('click', () => handleFilterClick(filterTab, 'feeType', feeType));
        filtersScroll.appendChild(filterTab);
    });
    
    // Bank filters
    filterValues.banks.forEach(bank => {
        const filterTab = document.createElement('button');
        filterTab.className = 'filter-tab';
        filterTab.textContent = bank;
        filterTab.dataset.filterType = 'bank';
        filterTab.dataset.filterValue = bank;
        filterTab.addEventListener('click', () => handleFilterClick(filterTab, 'bank', bank));
        filtersScroll.appendChild(filterTab);
    });
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
    
    // Set new active filter
    activeFilter = { filterTab, filterType, filterValue };
    filterTab.classList.add('active');
    
    // Apply filter with fade transition
    applyFilter(filterType, filterValue);
}

// Remove active filter
function removeActiveFilter() {
    if (!activeFilter) return;
    
    activeFilter.filterTab.classList.remove('active');
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
            canvas.style.width = '100%';
            canvas.style.height = 'auto';
            
            for (let i = 0; i < filteredData.length; i++) {
                const card = filteredData[i];
                const imagePath = imagePaths[i % imagePaths.length];
                const imageItem = createImageItem(imagePath, card, 0, i);
                imageItem.dataset.cardIndex = i;
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
                    const imagePath = imagePaths[cardIndex % imagePaths.length];
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
function applyFilter(filterType, filterValue) {
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
                }
                return true;
            });
        }
        
        // Clear canvas
        canvas.innerHTML = '';
        allImageItems = [];
        
        // Recreate grid with filtered data
        const isMobile = window.innerWidth <= 768;
        const canvasContainer = document.getElementById('canvasContainer');
        
        if (isMobile) {
            // Mobile: Reset canvas styles
            canvas.style.width = '100%';
            canvas.style.height = 'auto';
            
            // Mobile: Create vertical stack based on filtered data
            for (let i = 0; i < filteredData.length; i++) {
                const card = filteredData[i];
                const imagePath = imagePaths[i % imagePaths.length];
                const imageItem = createImageItem(imagePath, card, 0, i);
                imageItem.dataset.cardIndex = i;
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
            }
            
            // Scroll to top on mobile
            if (canvasContainer) {
                canvasContainer.scrollTo({ top: 0, behavior: 'smooth' });
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
                    const imagePath = imagePaths[cardIndex % imagePaths.length];
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
            
            // Scroll to center after grid is recreated - wait for layout
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
    if (!searchBar) return;
    
    // Handle search input
    searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchBar.value.trim();
            if (query.length > 0) {
                handleSearch(query);
            }
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
        const viewportHeight = window.innerHeight;
        const imageItems = document.querySelectorAll('.image-item');
        
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
                
                // Apply rotation
                imageContainer.style.transform = `rotateX(${rotation}deg)`;
            }
        });
        
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


