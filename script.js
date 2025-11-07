// Version: 2025-01-15-v6 - Match card names with actual credit card images
// Card data will be loaded from data.txt
let cardData = [];

// Available credit card images in Assets folder
const availableCardImages = [
    'HDFC Corporate Platinum Credit Card.png',
    'HDFC Diners Club Black.png',
    'HDFC Diners Club Premium.png',
    'HDFC EasyShop Platinum Credit Card.png',
    'HDFC Freedom Credit Card.png',
    'HDFC Freedom RuPay Credit Card.png',
    'HDFC IndiGo Credit Card.png',
    'HDFC Infinia Credit Card.png',
    'HDFC ISIC Student Forex Plus.png',
    'HDFC Marriott Bonvoy Credit Card.png',
    'HDFC Millennia Credit Card.png',
    'HDFC MoneyBack Plus Credit Card.png',
    'HDFC Pixel Play Credit Card.png',
    'HDFC Regalia Credit Card.png',
    'HDFC Regalia Gold Credit Card.png',
    'HDFC Solitaire Credit Card.png',
    'HDFC Swiggy Credit Card.png',
    'HDFC Tata Neu Infinity Credit Card.png',
    'HDFC Tata Neu Plus Credit Card.png',
    'SBI BPCL Octane Credit Card.png',
    'SBI Card ELITE.png',
    'SBI Card PRIME.png',
    'SBI Cashback Credit Card.png',
    'SBI Club Vistara Credit Card.png',
    'SBI Club Vistara Prime Credit Card.png',
    'SBI SimplyCLICK Credit Card.png',
    'SBI SimplySAVE Credit Card.png'
];

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
    
    // No match found
    console.warn(`No image found for card: "${cardName}"`);
    return null;
}

// Grid configuration
const GRID_COLS = 20; // Number of columns
const GRID_ROWS = 20; // Number of rows
const IMAGE_WIDTH = 257; // Width of each image in pixels
const IMAGE_HEIGHT = 158; // Height of each image in pixels
const GAP = 71; // Horizontal gap between images

// Load card data from data.txt
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
        return cardData;
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
        
        // If no data loaded, show error
        if (cardData.length === 0) {
            console.error('No card data loaded. Check data.txt file.');
            const canvas = document.getElementById('canvas');
            canvas.innerHTML = '<div style="padding: 50px; text-align: center; color: #999;">No card data found. Please check data.txt file.</div>';
            return;
        }
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
        
        // Create vertical stack based on card data
        createGrid(canvas);
    } else {
        // Desktop: Calculate total dimensions based on actual card count
        const totalCards = cardData.length;
        const totalRows = Math.ceil(totalCards / GRID_COLS);
        // Card height includes: image (158px) + card name (~20px) + network (~14px) = ~192px
        const CARD_TOTAL_HEIGHT = 192;
        const totalWidth = GRID_COLS * (IMAGE_WIDTH + GAP) + GAP;
        const totalHeight = totalRows * (CARD_TOTAL_HEIGHT + GAP) + GAP;
        
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
            
            // Start ripple animation from center after scrolling to center
            setTimeout(() => {
                startRippleAnimation();
            }, 50);
        }, 100);
    }
}

// Ripple animation from center (desktop only)
function startRippleAnimation() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return; // Only for desktop
    
    // Calculate center position of the grid
    const centerRow = Math.floor(Math.ceil(cardData.length / GRID_COLS) / 2);
    const centerCol = Math.floor(GRID_COLS / 2);
    
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
    const totalCards = cardData.length || 0;
    
    console.log(`Creating grid with ${totalCards} cards from data.txt`);
    
    if (totalCards === 0) {
        console.warn('No card data loaded, using fallback');
        return;
    }
    
    // Clear existing items
    allImageItems = [];
    
    // Track matched images for debugging
    let matchedCount = 0;
    
    if (isMobile) {
        // Mobile: Create vertical stack based on card data
        for (let i = 0; i < totalCards; i++) {
            const card = cardData[i];
            // Get matched image for this card
            const imagePath = getImagePathForCard(card['Card Name']);
            if (imagePath) matchedCount++;
            
            // Debug first 5 matches
            if (i < 5) {
                console.log(`Card ${i}: "${card['Card Name']}" -> ${imagePath || 'NO MATCH'}`);
            }
            
            // Create image item with card data
            const imageItem = createImageItem(imagePath, card, 0, i);
            imageItem.dataset.cardIndex = i;
            canvas.appendChild(imageItem);
            allImageItems.push(imageItem);
        }
    } else {
        // Desktop: Create grid based on card data
        const totalRows = Math.ceil(totalCards / GRID_COLS);
        let cardIndex = 0;
        for (let row = 0; row < totalRows && cardIndex < totalCards; row++) {
            for (let col = 0; col < GRID_COLS && cardIndex < totalCards; col++) {
                const card = cardData[cardIndex];
                // Get matched image for this card
                const imagePath = getImagePathForCard(card['Card Name']);
                if (imagePath) matchedCount++;
                
                // Debug first 5 matches
                if (cardIndex < 5) {
                    console.log(`Card ${cardIndex}: "${card['Card Name']}" -> ${imagePath || 'NO MATCH'}`);
                }
                
                // Create image item with card data
                const imageItem = createImageItem(imagePath, card, row, col);
                canvas.appendChild(imageItem);
                allImageItems.push(imageItem);
                cardIndex++;
            }
        }
    }
    
    console.log(`Matched ${matchedCount} out of ${totalCards} cards with images`);
    
    console.log(`Created ${totalCards} card items`);
    
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
    
    // Check if we have an image path
    if (imagePath) {
        // Create image
        const img = document.createElement('img');
        const pathParts = imagePath.split('/');
        const encodedPath = pathParts.map(part => encodeURIComponent(part)).join('/');
        img.src = encodedPath;
        img.alt = card ? card['Card Name'] : imagePath.split('/').pop();
        img.loading = 'lazy';
        
        img.onload = () => {
            imageItem.classList.add('visible');
        };
        
        img.onerror = (e) => {
            console.error('Failed to load image:', imagePath);
            imageContainer.style.background = '#e5e5e5';
            imageContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999; font-size: 12px;">Image not found</div>';
        };
        
        imageContainer.appendChild(img);
    } else {
        // No image path - show placeholder
        imageContainer.style.background = '#f5f5f5';
        imageContainer.style.border = '1px solid #e0e0e0';
        imageContainer.style.display = 'flex';
        imageContainer.style.alignItems = 'center';
        imageContainer.style.justifyContent = 'center';
        imageContainer.innerHTML = '<div style="color: #999; font-size: 12px; text-align: center; padding: 10px;">No image available</div>';
        // Mark as visible immediately for placeholder
        imageItem.classList.add('visible');
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
    
    cardData.forEach(card => {
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
            const cardsPerRow = GRID_COLS;
            const totalRows = Math.ceil(totalCards / cardsPerRow);
            const CARD_TOTAL_HEIGHT = 192;
            const totalWidth = GRID_COLS * (IMAGE_WIDTH + GAP) + GAP;
            const totalHeight = totalRows * (CARD_TOTAL_HEIGHT + GAP) + GAP;
            
            canvas.style.width = `${totalWidth}px`;
            canvas.style.minHeight = `${totalHeight}px`;
            canvas.style.height = 'auto';
            
            let cardIndex = 0;
            for (let row = 0; row < totalRows && cardIndex < filteredData.length; row++) {
                for (let col = 0; col < GRID_COLS && cardIndex < filteredData.length; col++) {
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
            // Desktop: Calculate grid dimensions based on filtered data
            const totalFilteredCards = filteredData.length;
            const cardsPerRow = GRID_COLS;
            const totalRows = Math.ceil(totalFilteredCards / cardsPerRow);
            
            // Calculate actual dimensions needed
            // Card height includes: image (158px) + card name (~20px) + network (~14px) = ~192px
            const CARD_TOTAL_HEIGHT = 192;
            const totalWidth = GRID_COLS * (IMAGE_WIDTH + GAP) + GAP;
            const totalHeight = totalRows * (CARD_TOTAL_HEIGHT + GAP) + GAP;
            
            // Set canvas size - use min-height to allow grid to grow with content
            canvas.style.width = `${totalWidth}px`;
            canvas.style.minHeight = `${totalHeight}px`;
            canvas.style.height = 'auto';
            
            // Desktop: Create grid based on filtered data
            let cardIndex = 0;
            for (let row = 0; row < totalRows && cardIndex < filteredData.length; row++) {
                for (let col = 0; col < GRID_COLS && cardIndex < filteredData.length; col++) {
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
    searchBar.placeholder = 'Analyzing 500 cards...';
    searchBar.disabled = true;
    
    try {
        const response = await fetch('/api/recommend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
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
                
                // Interpolate rotation: top (0deg) to bottom (-90deg)
                const rotation = -90 * normalizedPosition;
                
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


