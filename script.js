// Version: 2025-01-15-v2 - Using getBoundingClientRect with requestAnimationFrame
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

// Setup mobile scroll-based dynamic rotation (matching Safari tabs exactly)
function setupMobileInteractions(canvas) {
    const canvasContainer = document.getElementById('canvasContainer');
    const canvasWrapper = document.getElementById('canvasWrapper');
    const imageItems = Array.from(canvas.querySelectorAll('.image-item'));
    let tappedCardId = null;
    let scrollY = 0;
    let isDragging = false;
    let startY = 0;
    let velocity = 0;
    let lastY = 0;
    let lastTime = Date.now();
    
    console.log('Setting up mobile interactions, found', imageItems.length, 'cards');
    
    // Get all translate wrappers first
    const translateWrappers = Array.from(canvas.querySelectorAll('.image-translate-wrapper'));
    
    // Calculate total height needed for scrolling
    // Card height (200px) + spacing (-39px) = 161px per card
    const cardHeight = 200;
    const cardSpacing = -39;
    const actualCardHeight = cardHeight + cardSpacing; // 161px
    const totalCards = translateWrappers.length;
    const totalHeight = totalCards * actualCardHeight + 200; // Add padding
    canvasWrapper.style.minHeight = `${totalHeight}px`;
    
    // Use native scroll events instead of custom scrolling
    // Track scroll position from scrollTop
    let rafId = null;
    const handleScroll = () => {
        scrollY = canvasContainer.scrollTop;
        // Removed verbose logging for performance
        
        // Use requestAnimationFrame to ensure we read positions after browser renders
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            updateScroll();
        });
    };
    
    // Add scroll event listener
    canvasContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    // Get all translate wrappers and their inner elements (already defined above)
    const wrapperData = translateWrappers.map((translateWrapper, index) => {
        const rotateWrapper = translateWrapper.querySelector('.image-rotate-wrapper');
        const imageItem = translateWrapper.querySelector('.image-item');
        
        // Verify each card has its own unique wrapper
        if (!rotateWrapper) {
            console.error(`[ERROR] Card ${index}: No rotateWrapper found!`);
        }
        if (!imageItem) {
            console.error(`[ERROR] Card ${index}: No imageItem found!`);
        }
        
        return { translateWrapper, rotateWrapper, imageItem, index };
    });
    
    console.log(`[SETUP] Found ${wrapperData.length} cards, ${wrapperData.filter(w => w.rotateWrapper).length} with rotateWrapper`);
    
    // Update card rotations based on scroll and viewport position
    const updateCardRotations = (scrollY) => {
        const viewportHeight = window.innerHeight;
        const viewportTop = 0;
        const viewportBottom = viewportHeight;
        
        // Rotation values (reduced for less distortion with many cards)
        const topRotation = -5.0;       // Items at top of viewport (nearly flat)
        const bottomRotation = -25.0;   // Items entering from bottom (subtle angle)
        
        // OPTIMIZATION: Calculate approximate positions first to avoid getBoundingClientRect on all cards
        const cardHeight = 200;
        const cardSpacing = -39;
        const actualCardHeight = cardHeight + cardSpacing; // 161px per card
        const canvasTopPadding = 20;
        
        // Buffer zone: only check cards within 3 viewport heights of viewport (larger buffer for safety)
        const bufferZone = viewportHeight * 3;
        const checkRangeTop = viewportTop - bufferZone;
        const checkRangeBottom = viewportBottom + bufferZone;
        
        // First pass: Batch read all positions for cards in range (read phase)
        const cardsToUpdate = [];
        wrapperData.forEach(({ translateWrapper, rotateWrapper, imageItem, index }) => {
            if (!rotateWrapper || !imageItem) return;
            
            const offsetY = index * 8;
            
            // Handle tapped cards (rotate to 0°)
            if (imageItem.dataset.imagePath === tappedCardId || imageItem.classList.contains('tapped')) {
                rotateWrapper.style.transform = `rotateX(0deg)`;
                rotateWrapper.style.webkitTransform = `rotateX(0deg)`;
                translateWrapper.style.transform = `translate3d(0, ${offsetY}px, 0)`;
                translateWrapper.style.webkitTransform = `translate3d(0, ${offsetY}px, 0)`;
                return;
            }
            
            // Quick check: estimate if card might be in range
            // Account for both natural flow spacing AND translateY offset
            const translateYOffset = index * 8;
            const estimatedCardTop = canvasTopPadding + (index * actualCardHeight) + translateYOffset - scrollY;
            const estimatedCardBottom = estimatedCardTop + cardHeight;
            
            // Skip cards that are definitely far outside the range
            if (estimatedCardBottom < checkRangeTop || estimatedCardTop > checkRangeBottom) {
                // Card is far away - set default rotation without getBoundingClientRect
                rotateWrapper.style.transform = `rotateX(${bottomRotation}deg)`;
                rotateWrapper.style.webkitTransform = `rotateX(${bottomRotation}deg)`;
                translateWrapper.style.transform = `translate3d(0, ${offsetY}px, 0)`;
                translateWrapper.style.webkitTransform = `translate3d(0, ${offsetY}px, 0)`;
                return;
            }
            
            // Card is in range - add to batch for getBoundingClientRect
            cardsToUpdate.push({ translateWrapper, rotateWrapper, imageItem, index, offsetY });
        });
        
        // Second pass: Read positions for cards in range (batch read)
        cardsToUpdate.forEach(({ translateWrapper, rotateWrapper, imageItem, index, offsetY }) => {
            // Get actual viewport position using getBoundingClientRect (only for cards in range)
            const rect = imageItem.getBoundingClientRect();
            const cardTop = rect.top;
            const cardBottom = rect.bottom;
            const cardCenterY = rect.top + rect.height / 2;
            
            // Determine card position relative to viewport
            const isAboveViewport = cardBottom <= viewportTop;
            const isBelowViewport = cardTop >= viewportBottom;
            const isInViewport = !isAboveViewport && !isBelowViewport;
            
            let dynamicRotation;
            
            if (isInViewport) {
                // Card is visible in viewport - linear interpolation
                // Top of viewport (0): -10° (face-on, what you're looking at)
                // Bottom of viewport (1): -60° (angled away, entering from below)
                const cardPositionInViewport = cardCenterY - viewportTop;
                const normalizedPosition = Math.max(0, Math.min(1, cardPositionInViewport / viewportHeight));
                
                // Simple linear interpolation from top to bottom
                dynamicRotation = topRotation + normalizedPosition * (bottomRotation - topRotation);
            } else {
                // Card is outside viewport - use bottom rotation
                dynamicRotation = bottomRotation;
            }
            
            // Apply transforms (write phase)
            translateWrapper.style.transform = `translate3d(0, ${offsetY}px, 0)`;
            translateWrapper.style.webkitTransform = `translate3d(0, ${offsetY}px, 0)`;
            rotateWrapper.style.transform = `rotateX(${dynamicRotation}deg)`;
            rotateWrapper.style.webkitTransform = `rotateX(${dynamicRotation}deg)`;
        });
    };
    
    const updateScroll = () => {
        // No need to transform wrapper - native scroll handles it
        // Just update rotations based on scrollTop
        updateCardRotations(scrollY);
    };
    
    // Initial update
    updateScroll();
    
    // Track tapped card
    wrapperData.forEach(({ imageItem }) => {
        imageItem.addEventListener('click', () => {
            if (tappedCardId === imageItem.dataset.imagePath) {
                tappedCardId = null;
                imageItem.classList.remove('tapped');
            } else {
                wrapperData.forEach(({ imageItem: item }) => item.classList.remove('tapped'));
                tappedCardId = imageItem.dataset.imagePath;
                imageItem.classList.add('tapped');
            }
            
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
            
            updateScroll();
        });
    });
    
    // Update on resize
    window.addEventListener('resize', () => {
        updateScroll();
    });
    
    // COMMENTED OUT: Tap interaction - testing static 3D first
    // Track tapped card
    // imageItems.forEach((item) => {
    //     item.addEventListener('click', () => {
    //         // Toggle tapped state
    //         if (tappedCardId === item.dataset.imagePath) {
    //             tappedCardId = null;
    //             item.classList.remove('tapped');
    //         } else {
    //             // Remove tapped from all
    //             imageItems.forEach(i => i.classList.remove('tapped'));
    //             tappedCardId = item.dataset.imagePath;
    //             item.classList.add('tapped');
    //         }
    //         
    //         // Haptic feedback
    //         if (navigator.vibrate) {
    //             navigator.vibrate(10);
    //         }
    //         
    //         updateScroll();
    //     });
    // });
}

// Update card rotations based on scroll position (exact match to Safari tabs Swift code)
function updateCardRotations(imageItems, scrollY, tappedCardId) {
    const deviceHeight = window.innerHeight;
    const cardHeight = 200; // Card height
    const cardSpacing = -100; // Negative spacing (LazyVStack spacing: -100)
    const screenTop = 200; // Account for top padding
    
    imageItems.forEach((item, index) => {
        // Calculate offset Y (matching Swift: CGFloat(index) * 8)
        const offsetY = index * 8;
        
        // Handle tapped cards (rotate to 0°)
        if (item.dataset.imagePath === tappedCardId || item.classList.contains('tapped')) {
            // Tapped cards: rotate to 0° (flat)
            item.style.transform = `translate3d(0, ${offsetY}px, 0) rotateX(0deg)`;
            item.style.webkitTransform = `translate3d(0, ${offsetY}px, 0) rotateX(0deg)`;
            return;
        }
        
        // Calculate card position considering scroll
        // Base position of card in the stack
        const baseCardPosition = index * (cardHeight + cardSpacing);
        // Current position after scrolling (wrapper is translated by -scrollY)
        const currentCardPosition = baseCardPosition - scrollY;
        // Card center Y position relative to viewport
        const cardCenterY = currentCardPosition + cardHeight / 2;
        
        // Calculate distance from top of screen
        const distanceFromTop = cardCenterY - screenTop;
        
        // Normalize the distance to a 0-1 range for rotation interpolation
        const maxDistance = deviceHeight * 0.6; // Maximum distance for full rotation
        const normalizedDistance = Math.max(0, Math.min(1, distanceFromTop / maxDistance));
        
        // Interpolate between -10° (top) and -60° (bottom) - matching Swift exactly
        const topRotation = -10.0;
        const bottomRotation = -60.0;
        const dynamicRotation = topRotation + normalizedDistance * (bottomRotation - topRotation);
        
        // Apply rotation with 3D transform
        // Now that overflow is removed, simple rotateX should work
        const transformValue = `translate3d(0, ${offsetY}px, 0) rotateX(${dynamicRotation}deg)`;
        item.style.transform = transformValue;
        item.style.webkitTransform = transformValue;
        
        // DEBUG: Log rotation values
        if (index === 0) {
            console.log(`Card 0 rotation: ${dynamicRotation}deg, distanceFromTop: ${distanceFromTop}, normalized: ${normalizedDistance}, scrollY: ${scrollY}`);
        }
        
        // Image should automatically rotate with parent due to transform-style: preserve-3d
        // No need to set transform on image - it inherits from parent
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

