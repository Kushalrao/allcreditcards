// Version: 2025-01-15-v4 - No rotation, mobile and desktop same structure
// Image paths from Assets folder
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

// Grid configuration
const GRID_COLS = 20; // Number of columns
const GRID_ROWS = 20; // Number of rows
const IMAGE_WIDTH = 218; // Width of each image in pixels (67% of 325px)
const IMAGE_HEIGHT = 134; // Height of each image in pixels (67% of 200px)
const GAP = 43; // Gap between images (consistent horizontal and vertical)

// Initialize canvas
function initCanvas() {
    const canvas = document.getElementById('canvas');
    const canvasContainer = document.getElementById('canvasContainer');
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Mobile: Don't set fixed dimensions, let it flow naturally
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        
        // Create vertical stack of 8 images
        createGrid(canvas);
        
        // Setup mobile interactions
        setupMobileInteractions(canvas);
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


// Create grid of images
function createGrid(canvas) {
    let imageIndex = 0;
    const usedImages = new Set();
    const isMobile = window.innerWidth <= 768;
    
    console.log('Total images available:', imagePaths.length);
    console.log('Image paths:', imagePaths);
    
    if (isMobile) {
        // Mobile: Create vertical stack with 100 cards (repeating the 8 images)
        const totalCards = 100;
        for (let i = 0; i < totalCards; i++) {
            // Cycle through images
            const imagePath = imagePaths[i % imagePaths.length];
            usedImages.add(imagePath);
            
            // Create image item (same structure as desktop)
            const imageItem = createImageItem(imagePath, 0, i);
            imageItem.dataset.cardIndex = i;
            canvas.appendChild(imageItem);
        }
    } else {
        // Desktop: Create grid
        for (let row = 0; row < GRID_ROWS; row++) {
            for (let col = 0; col < GRID_COLS; col++) {
                // Cycle through images
                const imagePath = imagePaths[imageIndex % imagePaths.length];
                usedImages.add(imagePath);
                imageIndex++;
                
                // Create image item
                const imageItem = createImageItem(imagePath, row, col);
                canvas.appendChild(imageItem);
            }
        }
    }
    
    console.log('Images used in grid:', usedImages.size, 'out of', imagePaths.length);
}

// Create an image item element (same for mobile and desktop)
function createImageItem(imagePath, row, col) {
    const imageItem = document.createElement('div');
    imageItem.className = 'image-item';
    imageItem.dataset.imagePath = imagePath;
    imageItem.dataset.row = row;
    imageItem.dataset.col = col;
    
    const img = document.createElement('img');
    const pathParts = imagePath.split('/');
    const encodedPath = pathParts.map(part => encodeURIComponent(part)).join('/');
    img.src = encodedPath;
    img.alt = imagePath.split('/').pop();
    img.loading = 'lazy';
    
    img.onload = () => {
        imageItem.classList.add('visible');
    };
    
    img.onerror = (e) => {
        console.error('Failed to load image:', imagePath);
        imageItem.style.background = '#e5e5e5';
        imageItem.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999;">Image not found</div>';
    };
    
    imageItem.appendChild(img);
    
    return imageItem;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCanvas);
} else {
    initCanvas();
}

