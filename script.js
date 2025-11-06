// Version: 2025-01-15-v5 - Load card data from data.txt and display card names/networks
// Image paths from Assets folder (will cycle through for cards)
const imagePaths = [
    'Assets/1.png',
    'Assets/2.png',
    'Assets/3.png',
    'Assets/4.png',
    'Assets/5.png',
    'Assets/6.png',
    'Assets/7.png',
    'Assets/8.png'
];

// Card data will be loaded from data.txt
let cardData = [];

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
        // Desktop: Calculate total dimensions
        const totalWidth = GRID_COLS * (IMAGE_WIDTH + GAP) + GAP;
        const totalHeight = GRID_ROWS * (IMAGE_HEIGHT + GAP) + GAP;
        
        // Set canvas size
        canvas.style.width = `${totalWidth}px`;
        canvas.style.height = `${totalHeight}px`;
        
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
        }, 100);
    }
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
    
    if (isMobile) {
        // Mobile: Create vertical stack based on card data
        for (let i = 0; i < totalCards; i++) {
            const card = cardData[i];
            // Cycle through available images
            const imagePath = imagePaths[i % imagePaths.length];
            
            // Create image item with card data
            const imageItem = createImageItem(imagePath, card, 0, i);
            imageItem.dataset.cardIndex = i;
            canvas.appendChild(imageItem);
            allImageItems.push(imageItem);
        }
    } else {
        // Desktop: Create grid based on card data
        let cardIndex = 0;
        for (let row = 0; row < GRID_ROWS && cardIndex < totalCards; row++) {
            for (let col = 0; col < GRID_COLS && cardIndex < totalCards; col++) {
                const card = cardData[cardIndex];
                // Cycle through available images
                const imagePath = imagePaths[cardIndex % imagePaths.length];
                
                // Create image item with card data
                const imageItem = createImageItem(imagePath, card, row, col);
                canvas.appendChild(imageItem);
                allImageItems.push(imageItem);
                cardIndex++;
            }
        }
    }
    
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
        imageContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999;">Image not found</div>';
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

// Apply filter with fade transition
function applyFilter(filterType, filterValue) {
    // Step 1: Fade out all cards
    allImageItems.forEach(item => {
        item.classList.remove('fade-in');
        item.classList.add('fade-out');
    });
    
    // Step 2: After fade out, filter and fade in
    setTimeout(() => {
        allImageItems.forEach(item => {
            let shouldShow = true;
            
            if (filterType && filterValue) {
                const itemValue = item.dataset[filterType];
                shouldShow = itemValue === filterValue;
            }
            
            if (shouldShow) {
                item.style.display = '';
                item.classList.remove('fade-out');
                // Force reflow to ensure transition
                void item.offsetHeight;
                item.classList.add('fade-in');
            } else {
                item.style.display = 'none';
                item.classList.remove('fade-out', 'fade-in');
            }
        });
    }, 300); // Wait for fade out to complete
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCanvas);
} else {
    initCanvas();
}

