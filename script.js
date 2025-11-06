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
    
    // Calculate total dimensions
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

// Enhanced smooth scroll with momentum for diagonal scrolling
let scrollVelocity = { x: 0, y: 0 };
let lastScrollTime = Date.now();
let lastScrollPosition = { x: 0, y: 0 };

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
        }
    }, { passive: true });

    // Enable smooth wheel scrolling for diagonal movement
    canvasContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        const deltaX = e.deltaX || 0;
        const deltaY = e.deltaY || 0;
        
        // Smooth diagonal scrolling
        canvasContainer.scrollBy({
            left: deltaX,
            top: deltaY,
            behavior: 'smooth'
        });
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
        // Mobile: Create vertical stack
        for (let i = 0; i < imagePaths.length; i++) {
            const imagePath = imagePaths[imageIndex % imagePaths.length];
            usedImages.add(imagePath);
            imageIndex++;
            
            // Create wrapper for card + button
            const cardWrapper = document.createElement('div');
            cardWrapper.className = 'card-wrapper';
            cardWrapper.style.position = 'relative';
            
            // Create image item
            const imageItem = createImageItem(imagePath, 0, i);
            cardWrapper.appendChild(imageItem);
            
            // Create View More button
            const viewMoreButton = document.createElement('button');
            viewMoreButton.className = 'view-more-button';
            viewMoreButton.textContent = 'View More';
            viewMoreButton.dataset.cardIndex = i;
            cardWrapper.appendChild(viewMoreButton);
            
            canvas.appendChild(cardWrapper);
        }
        
        // Setup mobile interactions
        setupMobileInteractions(canvas);
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

// Create an image item element
function createImageItem(imagePath, row, col) {
    const imageItem = document.createElement('div');
    imageItem.className = 'image-item';
    imageItem.dataset.imagePath = imagePath;
    imageItem.dataset.row = row;
    imageItem.dataset.col = col;
    
    const img = document.createElement('img');
    // URL encode the path for HTTP server (spaces need to be %20)
    // Split path into parts, encode each part separately, then join
    const pathParts = imagePath.split('/');
    const encodedPath = pathParts.map(part => encodeURIComponent(part)).join('/');
    img.src = encodedPath;
    img.alt = imagePath.split('/').pop();
    img.loading = 'lazy';
    
    // Handle image load
    img.onload = () => {
        imageItem.classList.add('visible');
    };
    
    // Handle image error - log for debugging
    img.onerror = (e) => {
        console.error('Failed to load image:', imagePath);
        imageItem.style.background = '#e5e5e5';
        imageItem.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999;">Image not found</div>';
    };
    
    imageItem.appendChild(img);
    
    // Add interactive 3D rotation on desktop only
    if (window.innerWidth > 768) {
        setup3DRotation(imageItem);
    } else {
        // Mobile: Setup tap interaction
        setupMobileTapInteraction(imageItem);
    }
    
    return imageItem;
}

// Setup mobile tap interaction
function setupMobileTapInteraction(imageItem) {
    imageItem.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Remove tapped class from all cards
        document.querySelectorAll('.image-item').forEach(item => {
            if (item !== imageItem) {
                item.classList.remove('tapped');
            }
        });
        
        // Toggle tapped state
        if (imageItem.classList.contains('tapped')) {
            imageItem.classList.remove('tapped');
            // Hide View More button
            const button = imageItem.parentElement.querySelector('.view-more-button');
            if (button) {
                button.classList.remove('show');
            }
        } else {
            imageItem.classList.add('tapped');
            // Show View More button
            const button = imageItem.parentElement.querySelector('.view-more-button');
            if (button) {
                button.classList.add('show');
            }
        }
        
        // Haptic feedback (if available)
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    });
}

// Setup mobile scroll-based dynamic rotation
function setupMobileInteractions(canvas) {
    const canvasContainer = document.getElementById('canvasContainer');
    const imageItems = canvas.querySelectorAll('.image-item');
    let scrollOffset = 0;
    let tappedCardId = null;
    
    // Track scroll position
    canvasContainer.addEventListener('scroll', () => {
        scrollOffset = canvasContainer.scrollTop;
        updateCardRotations(imageItems, scrollOffset, tappedCardId);
    }, { passive: true });
    
    // Initial rotation update
    updateCardRotations(imageItems, scrollOffset, tappedCardId);
    
    // Update rotations when window resizes
    window.addEventListener('resize', () => {
        updateCardRotations(imageItems, scrollOffset, tappedCardId);
    });
    
    // Track tapped card
    imageItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            tappedCardId = item.dataset.imagePath;
            updateCardRotations(imageItems, scrollOffset, tappedCardId);
        });
    });
}

// Update card rotations based on scroll position
function updateCardRotations(imageItems, scrollOffset, tappedCardId) {
    const deviceHeight = window.innerHeight;
    const screenTop = 200; // Account for top padding and safe area
    
    imageItems.forEach((item, index) => {
        // Skip if card is tapped
        if (item.dataset.imagePath === tappedCardId || item.classList.contains('tapped')) {
            return;
        }
        
        // Get actual card position relative to viewport
        const rect = item.getBoundingClientRect();
        const cardCenterY = rect.top + rect.height / 2;
        
        // Calculate distance from top of screen
        const distanceFromTop = cardCenterY - screenTop;
        
        // Normalize distance (0-1 range)
        const maxDistance = deviceHeight * 0.6;
        const normalizedDistance = Math.max(0, Math.min(1, distanceFromTop / maxDistance));
        
        // Interpolate between -10° (top) and -60° (bottom)
        const topRotation = -10;
        const bottomRotation = -60;
        const dynamicRotation = topRotation + normalizedDistance * (bottomRotation - topRotation);
        
        // Apply rotation with perspective
        item.style.transform = `perspective(1000px) rotateX(${dynamicRotation}deg)`;
    });
}

// Setup interactive 3D rotation based on cursor position
function setup3DRotation(imageItem) {
    const maxRotation = 13; // Maximum rotation in degrees
    
    imageItem.addEventListener('mousemove', (e) => {
        const rect = imageItem.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate mouse position relative to card center
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // Calculate rotation angles (normalized to -1 to 1, then multiplied by maxRotation)
        // Clamp values to ensure they don't exceed maxRotation
        const rotateY = Math.max(-maxRotation, Math.min(maxRotation, (mouseX / (rect.width / 2)) * maxRotation));
        const rotateX = Math.max(-maxRotation, Math.min(maxRotation, -(mouseY / (rect.height / 2)) * maxRotation));
        
        // Apply 3D rotation with scale - using translateZ for better 3D effect
        imageItem.style.transform = `perspective(1000px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    imageItem.addEventListener('mouseleave', () => {
        // Reset to default state when mouse leaves
        imageItem.style.transform = 'perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
    
    imageItem.addEventListener('mouseenter', () => {
        // Slight scale on enter
        imageItem.style.transform = 'perspective(1000px) scale(1.02) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCanvas);
} else {
    initCanvas();
}

