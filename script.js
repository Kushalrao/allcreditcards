// Version: 2025-01-15-v3 - Fixed rotation at -30deg baseline
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
            
            // Create image item directly (no wrapper needed)
            const imageItem = createImageItem(imagePath, 0, i);
            imageItem.dataset.cardIndex = i;
            canvas.appendChild(imageItem);
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
    const isMobile = window.innerWidth <= 768;
    
    // For mobile: Use wrapper approach for 3D
    if (isMobile) {
        // Outer wrapper for translation
        const translateWrapper = document.createElement('div');
        translateWrapper.className = 'image-translate-wrapper';
        
        // Inner wrapper for rotation
        const rotateWrapper = document.createElement('div');
        rotateWrapper.className = 'image-rotate-wrapper';
        
        // The actual image item
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
        rotateWrapper.appendChild(imageItem);
        translateWrapper.appendChild(rotateWrapper);
        
        // Mobile: Setup tap interaction
        setupMobileTapInteraction(imageItem);
        
        return translateWrapper;
    } else {
        // Desktop: Original structure
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
        setup3DRotation(imageItem);
        
        return imageItem;
    }
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
        
        // Toggle tapped state (rotate to 0° or back to rotated)
        if (imageItem.classList.contains('tapped')) {
            imageItem.classList.remove('tapped');
        } else {
            imageItem.classList.add('tapped');
        }
        
        // Haptic feedback (if available)
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    });
}

// Setup mobile interactions - FIXED ROTATION ONLY
function setupMobileInteractions(canvas) {
    const translateWrappers = Array.from(canvas.querySelectorAll('.image-translate-wrapper'));
    let tappedCardId = null;
    const FIXED_ROTATION = -30.0;
    
    console.log(`[MOBILE SETUP] Found ${translateWrappers.length} cards - applying FIXED ${FIXED_ROTATION}° rotation to ALL`);
    
    // Apply fixed rotation to all cards ONCE - no scroll listeners
    translateWrappers.forEach((translateWrapper, index) => {
        const rotateWrapper = translateWrapper.querySelector('.image-rotate-wrapper');
        const imageItem = translateWrapper.querySelector('.image-item');
        
        if (!rotateWrapper || !imageItem) {
            console.error(`[ERROR] Card ${index}: Missing wrapper or item`);
            return;
        }
        
        const offsetY = index * 8;
        
        // Apply fixed transforms - SET ONCE, NEVER CHANGE
        translateWrapper.style.transform = `translate3d(0, ${offsetY}px, 0)`;
        translateWrapper.style.webkitTransform = `translate3d(0, ${offsetY}px, 0)`;
        rotateWrapper.style.transform = `rotateX(${FIXED_ROTATION}deg)`;
        rotateWrapper.style.webkitTransform = `rotateX(${FIXED_ROTATION}deg)`;
        
        // Store expected rotation value for monitoring
        rotateWrapper.dataset.expectedRotation = FIXED_ROTATION;
        
        // Monitor if transform changes (to detect if something else is modifying it)
        if (index === 0) {
            const checkTransform = () => {
                const currentTransform = rotateWrapper.style.transform;
                if (!currentTransform.includes(`${FIXED_ROTATION}deg`) && !imageItem.classList.contains('tapped')) {
                    console.warn(`[WARNING] Card 0 transform changed! Expected ${FIXED_ROTATION}°, got: ${currentTransform}`);
                }
            };
            // Check periodically
            setInterval(checkTransform, 1000);
        }
        
        // Verify it was set
        if (index < 3) {
            console.log(`[CARD ${index}] Set rotation to ${FIXED_ROTATION}°`);
        }
        
        // Handle tap interaction - ONLY changes tapped card to 0°, rest stay at FIXED_ROTATION
        imageItem.addEventListener('click', () => {
            // Toggle tapped state
            if (tappedCardId === imageItem.dataset.imagePath) {
                // Untap: restore to fixed rotation
                tappedCardId = null;
                imageItem.classList.remove('tapped');
                rotateWrapper.style.transform = `rotateX(${FIXED_ROTATION}deg)`;
                rotateWrapper.style.webkitTransform = `rotateX(${FIXED_ROTATION}deg)`;
            } else {
                // Tap: set all others to fixed rotation, this one to 0°
                translateWrappers.forEach((tw) => {
                    const rw = tw.querySelector('.image-rotate-wrapper');
                    const ii = tw.querySelector('.image-item');
                    ii.classList.remove('tapped');
                    rw.style.transform = `rotateX(${FIXED_ROTATION}deg)`;
                    rw.style.webkitTransform = `rotateX(${FIXED_ROTATION}deg)`;
                });
                
                tappedCardId = imageItem.dataset.imagePath;
                imageItem.classList.add('tapped');
                rotateWrapper.style.transform = `rotateX(0deg)`;
                rotateWrapper.style.webkitTransform = `rotateX(0deg)`;
            }
            
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        });
    });
    
    // CRITICAL: Verify NO scroll listeners exist
    console.log(`[MOBILE SETUP] Complete - NO scroll listeners should exist`);
    console.log(`[VERIFY] Check browser console - if you see rotation changing on scroll, something else is modifying transforms`);
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

