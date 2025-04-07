// Product page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart if not exists
    if (!localStorage.getItem('cartItems')) {
        localStorage.setItem('cartItems', JSON.stringify([]));
    }
    
    // Update cart display
    updateCartDisplay();
    
    // Setup thumbnail gallery
    setupThumbnailGallery();
    
    // Setup quantity selector
    setupQuantitySelector();
    
    // Setup product tabs
    setupProductTabs();
    
    // Setup star rating in review form
    setupStarRating();
    
    // Setup add to cart button
    setupAddToCartButton();
});

// Setup thumbnail gallery
function setupThumbnailGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');
    
    if (!thumbnails.length || !mainImage) return;
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(thumb => {
                thumb.classList.remove('active');
            });
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image
            const imageUrl = this.getAttribute('data-image');
            mainImage.src = imageUrl;
        });
    });
}

// Setup quantity selector
function setupQuantitySelector() {
    const decreaseBtn = document.querySelector('.quantity-btn.decrease');
    const increaseBtn = document.querySelector('.quantity-btn.increase');
    const quantityInput = document.querySelector('.quantity-input');
    
    if (!decreaseBtn || !increaseBtn || !quantityInput) return;
    
    decreaseBtn.addEventListener('click', function() {
        let quantity = parseInt(quantityInput.value);
        if (quantity > 1) {
            quantityInput.value = quantity - 1;
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        let quantity = parseInt(quantityInput.value);
        quantityInput.value = quantity + 1;
    });
    
    quantityInput.addEventListener('change', function() {
        let quantity = parseInt(this.value);
        if (isNaN(quantity) || quantity < 1) {
            this.value = 1;
        }
    });
}

// Setup product tabs
function setupProductTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    if (!tabButtons.length || !tabPanels.length) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });

            tabPanels.forEach(panel => {
                panel.classList.remove('active');
            });

            // Add active class to clicked button
            this.classList.add('active');

            // Show corresponding panel
            const tabId = this.getAttribute('data-tab');
            const panel = document.getElementById(tabId);
            if (panel) {
                panel.classList.add('active');
            }
        });
    });
}

// Setup star rating in review form
function setupStarRating() {
    const stars = document.querySelectorAll('.star-rating i');
    
    if (!stars.length) return;
    
    stars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            
            // Highlight stars on hover
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                } else {
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
        });
        
        star.addEventListener('mouseout', function() {
            // Reset stars if no rating is selected
            const selectedRating = document.querySelector('.star-rating').getAttribute('data-selected');
            
            if (!selectedRating) {
                stars.forEach(s => {
                    s.classList.remove('fas');
                    s.classList.add('far');
                });
            } else {
                // Restore selected rating
                const rating = parseInt(selectedRating);
                
                stars.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            }
        });
        
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            
            // Set selected rating
            document.querySelector('.star-rating').setAttribute('data-selected', rating);
            
            // Update stars
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                } else {
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
        });
    });
}

// Setup add to cart button
function setupAddToCartButton() {
    const addToCartBtn = document.getElementById('add-to-cart');
    
    if (!addToCartBtn) return;
    
    addToCartBtn.addEventListener('click', function() {
        // Get product details
        const productName = document.querySelector('.product-title').textContent;
        const productPrice = parseFloat(document.querySelector('.current-price').textContent);
        const productImage = document.getElementById('main-product-image').src;
        const quantity = parseInt(document.querySelector('.quantity-input').value);
        
        // Add to cart
        addToCart(productName, productPrice, productImage, quantity);
    });
}

// Add product to cart
function addToCart(name, price, image, quantity = 1) {
    // Get current cart
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Check if product already in cart
    const existingItemIndex = cartItems.findIndex(item => item.name === name);
    
    if (existingItemIndex !== -1) {
        // Increase quantity if already in cart
        cartItems[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        cartItems.push({
            name,
            price,
            image,
            quantity
        });
    }
    
    // Save updated cart
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Update cart display
    updateCartDisplay();
    
    // Show success message
    showAddToCartMessage(name);
}

// Update cart display in header
function updateCartDisplay() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Calculate total
    const total = cartItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);
    
    // Update cart total in header
    const cartTotal = document.getElementById('cart-total');
    if (cartTotal) {
        cartTotal.textContent = `${total.toFixed(2)}EGP`;
    }
}

// Show "Added to Cart" message
function showAddToCartMessage(productName) {
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = 'add-to-cart-message';
    messageElement.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>تمت إضافة "${productName}" إلى سلة التسوق</span>
    `;
    
    // Add to body
    document.body.appendChild(messageElement);
    
    // Show message
    setTimeout(() => {
        messageElement.classList.add('show');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        messageElement.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, 300);
    }, 3000);
}
// /////////////////////////////////////////////////
// Function to load all products from API
async function loadProducts() {
    const currentLang = window.getCurrentLanguage ? window.getCurrentLanguage() : $('html').attr('lang') || 'ar';
    console.log('Loading all products for language:', currentLang);

    const loadingText = window.translateText ? window.translateText('جاري تحميل المنتجات...') : 'جاري تحميل المنتجات...';
    $('.featured-carousel').html(`<div class="loading-products">${loadingText}</div>`);

    try {
        const result = await ContentService.getProducts(currentLang);
        console.log('All Products API response:', result);

        let products = [];

        // Handle different response structures
        if (result.success && Array.isArray(result.data)) {
            products = result.data;
        } else if (result.success && result.data?.data && Array.isArray(result.data.data)) {
            products = result.data.data;
        }

        if (products.length > 0) {
            $('.featured-carousel').empty();
            let productsAdded = 0;

            products.forEach((product, index) => {
                try {
                    const productId = product.id || product.documentId || `prod-${index + 1}`;
                    const productName = product.attributes?.title || product.attributes?.name || product.title || product.name || 'منتج بدون اسم';

                    let imageUrl = '';
                    const imgAttr = product.attributes?.images?.data?.[0]?.attributes;
                    if (imgAttr?.url) {
                        imageUrl = API_BASE_URL + imgAttr.url;
                    }

                    const price = product.attributes?.price || product.price || 0;
                    const oldPrice = product.attributes?.old_price || product.old_price || 0;

                    let badge = '';
                    if (product.attributes?.is_new || product.is_new) {
                        badge = 'جديد';
                    } else if (oldPrice > price) {
                        const discount = Math.round(((oldPrice - price) / oldPrice) * 100);
                        badge = `خصم ${discount}%`;
                    }

                    const productHtml = `
                        <div class="product-card" data-id="${productId}">
                            <div class="product-image">
                                <img src="${imageUrl}" alt="${productName}">
                                <div class="product-actions">
                                    <button class="action-btn" onclick="addToCartFromPopular(event, this)"
                                        data-product-id="${productId}"
                                        data-product-name="${productName}"
                                        data-product-price="${price}">
                                        <i class="fas fa-shopping-cart"></i>
                                    </button>
                                    <button class="action-btn add-to-wishlist" onclick="addToWishlistFromPopular(event, this)"
                                        data-product-id="${productId}">
                                        <i class="far fa-heart"></i>
                                    </button>
                                    <button class="action-btn product-view-btn" onclick="viewProductModal(event, this)"
                                        data-product-id="${productId}"
                                        data-product-name="${productName}"
                                        data-product-price="${price}"
                                        data-product-image="${imageUrl}">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="featured-info">
                                <h3 class="featured-title">${productName}</h3>
                                <div class="featured-price">
                                    <span class="current-price">${price} جنيه</span>
                                    ${oldPrice > 0 ? `<span class="old-price">${oldPrice} جنيه</span>` : ''}
                                </div>
                                <div class="featured-rating">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star-half-alt"></i>
                                    <span class="rating-count">(32 تقييم)</span>
                                </div>
                            </div>
                        </div>
                    `;

                    $('.featured-carousel').append(productHtml);
                    productsAdded++;
                } catch (error) {
                    console.error(`Error rendering product ${index + 1}:`, error, product);
                }
            });

            if (productsAdded === 0) {
                const errorText = window.translateText ? window.translateText('عذراً، لا يمكن عرض المنتجات. يرجى المحاولة مرة أخرى لاحقاً.') : 'عذراً، لا يمكن عرض المنتجات. يرجى المحاولة مرة أخرى لاحقاً.';
                $('.featured-carousel').html(`<div class="products-error">${errorText}</div>`);
            }
        } else {
            const errorText = window.translateText ? window.translateText('لم يتم العثور على منتجات.') : 'لم يتم العثور على منتجات.';
            $('.featured-carousel').html(`<div class="products-error">${errorText}</div>`);
        }
    } catch (error) {
        console.error('Error in loadProducts:', error);
        const errorText = window.translateText ? window.translateText('عذراً، حدث خطأ أثناء تحميل المنتجات.') : 'عذراً، حدث خطأ أثناء تحميل المنتجات.';
        $('.featured-carousel').html(`<div class="products-error">${errorText}</div>`);
    }
}
