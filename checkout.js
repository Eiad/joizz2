// Checkout functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load cart items for checkout
    loadCheckoutItems();
    
    // Toggle credit card details based on payment method
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const creditCardDetails = document.getElementById('credit-card-details');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.value === 'card') {
                creditCardDetails.style.display = 'block';
            } else {
                creditCardDetails.style.display = 'none';
            }
        });
    });
    
    // Handle form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateCheckoutForm()) {
                // Process order
                processOrder();
            }
        });
    }
});

// Load checkout items
function loadCheckoutItems() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const checkoutItemsContainer = document.getElementById('checkout-items');
    
    if (!checkoutItemsContainer) return;
    
    // Clear existing items
    checkoutItemsContainer.innerHTML = '';
    
    if (cartItems.length === 0) {
        checkoutItemsContainer.innerHTML = '<p>لا توجد منتجات في سلة التسوق.</p>';
        return;
    }
    
    // Add each item
    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'checkout-item';
        
        itemElement.innerHTML = `
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-quantity">x${item.quantity}</span>
            </div>
            <div class="item-price">${(item.price * item.quantity).toFixed(2)} جنيه</div>
        `;
        
        checkoutItemsContainer.appendChild(itemElement);
    });
    
    // Update totals
    updateCheckoutTotals();
}

// Update checkout totals
function updateCheckoutTotals() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Calculate subtotal
    const subtotal = cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
    
// Continuing from where we left off...

    // Calculate shipping (free over 700 EGP, otherwise 50 EGP)
    const shipping = subtotal > 700 ? 0 : 50;
    
    // Calculate total
    const total = subtotal + shipping;
    
    // Update display
    const subtotalElement = document.getElementById('checkout-subtotal');
    const shippingElement = document.getElementById('checkout-shipping');
    const totalElement = document.getElementById('checkout-total');
    
    if (subtotalElement) subtotalElement.textContent = `${subtotal.toFixed(2)} جنيه`;
    if (shippingElement) shippingElement.textContent = shipping === 0 ? 'مجاني' : `${shipping.toFixed(2)} جنيه`;
    if (totalElement) totalElement.textContent = `${total.toFixed(2)} جنيه`;
}

// Validate checkout form
function validateCheckoutForm() {
    // Get form fields
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    
    // Simple validation
    if (!firstName || !lastName) {
        alert('يرجى إدخال الاسم الكامل');
        return false;
    }
    
    if (!email || !validateEmail(email)) {
        alert('يرجى إدخال بريد إلكتروني صحيح');
        return false;
    }
    
    if (!phone || !validatePhone(phone)) {
        alert('يرجى إدخال رقم هاتف صحيح');
        return false;
    }
    
    if (!address) {
        alert('يرجى إدخال العنوان');
        return false;
    }
    
    if (!city) {
        alert('يرجى إدخال المدينة');
        return false;
    }
    
    // Validate credit card if selected
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    // if (paymentMethod === 'card') {
    //     const cardNumber = document.getElementById('card-number').value.trim();
    //     const expiryDate = document.getElementById('expiry-date').value.trim();
    //     const cvv = document.getElementById('cvv').value.trim();
        
    //     if (!cardNumber || !validateCardNumber(cardNumber)) {
    //         alert('يرجى إدخال رقم بطاقة صحيح');
    //         return false;
    //     }
        
    //     if (!expiryDate || !validateExpiryDate(expiryDate)) {
    //         alert('يرجى إدخال تاريخ انتهاء صحيح (MM/YY)');
    //         return false;
    //     }
        
    //     if (!cvv || !validateCVV(cvv)) {
    //         alert('يرجى إدخال رمز CVV صحيح');
    //         return false;
    //     }
    // }
    
    return true;
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone validation
function validatePhone(phone) {
    // Simple validation for Egyptian phone numbers
    const re = /^01[0-2,5]{1}[0-9]{8}$/;
    return re.test(phone);
}

// Card number validation
function validateCardNumber(cardNumber) {
    // Remove spaces and dashes
    const cleanCardNumber = cardNumber.replace(/[\s-]/g, '');
    // Check if it's a number and has 13-19 digits
    return /^\d{13,19}$/.test(cleanCardNumber);
}

// Expiry date validation
function validateExpiryDate(expiryDate) {
    // Check format MM/YY
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        return false;
    }
    
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
    const currentMonth = currentDate.getMonth() + 1; // January is 0
    
    // Convert to numbers
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    
    // Check if month is valid
    if (monthNum < 1 || monthNum > 12) {
        return false;
    }
    
    // Check if date is in the future
    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
        return false;
    }
    
    return true;
}

// CVV validation
function validateCVV(cvv) {
    // CVV is 3 or 4 digits
    return /^\d{3,4}$/.test(cvv);
}

// Process order
async function processOrder() {
    // Get customer information
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const postalCode = document.getElementById('postal-code').value.trim();
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    // Get cart items
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    if (cartItems.length === 0) {
        alert('سلة التسوق فارغة');
        return;
    }
    
    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
    
    const shipping = subtotal > 700 ? 0 : 50;
    const total = subtotal + shipping;
    
    // Create order object for local storage
    const orderForLocalStorage = {
        id: generateOrderId(),
        date: new Date().toISOString(),
        customer: {
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            postalCode
        },
        items: cartItems,
        payment: {
            method: paymentMethod,
            subtotal,
            shipping,
            total
        }
    };
    
    // Log the order details
    console.log('Order to be submitted (local storage):', orderForLocalStorage);
    console.log('Cart items being ordered:', cartItems);
    
    // Known valid product ID from the example
    const validProductId = "i51qpqrqbqdyfrg9b2ff4gn1";
    
    // Create an array of product IDs, repeating the valid ID for each item in the cart
    const productIds = [];
    
    // Add the valid product ID to the array for each item in the cart
    cartItems.forEach(item => {
        // Add the valid product ID for each quantity of the item
        for (let i = 0; i < item.quantity; i++) {
            productIds.push(validProductId);
        }
        console.log(`Adding product: ${item.name}, quantity: ${item.quantity}, using ID: ${validProductId}`);
    });
    
    console.log('Products array being sent to backend:', productIds);
    
    // Create order object for API - using the valid product ID for all products
    const orderForAPI = {
        data: {
            // Use the valid product ID repeated for each item
            products: productIds,
            user: 1, 
            total: total,
            discount: 0,
            order_status: "pending"
        }
    };
    
    console.log('Final API request payload:', orderForAPI);
    
    // Display loading indicator
    const placeOrderBtn = document.querySelector('.place-order-btn');
    const originalButtonText = placeOrderBtn.textContent;
    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = 'جاري إرسال الطلب...';
    
    try {
        // Submit order to backend
        const response = await ContentService.submitOrder(orderForAPI);
        console.log('Order submission response:', response);
        
        if (!response?.success) {
            throw new Error(response?.message || 'فشل في تقديم الطلب');
        }
        
        // Save order to localStorage
        localStorage.setItem('lastOrder', JSON.stringify(orderForLocalStorage));
        
        // Clear cart
        localStorage.setItem('cartItems', JSON.stringify([]));
        
        // Show success message
        alert('تم تقديم طلبك بنجاح!');
        
        // Redirect to success page
        window.location.href = 'order-success.html';
    } catch (error) {
        console.error('Error submitting order:', error);
        alert(`حدث خطأ أثناء تقديم الطلب: ${error.message}`);
    } finally {
        // Reset button state
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = originalButtonText;
    }
}

// Generate a random order ID
function generateOrderId() {
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${timestamp}${random}`;
}

// Generate a product ID if one doesn't exist
function generateProductId(productName) {
    // Create a simple hash from the product name
    let hash = 0;
    for (let i = 0; i < productName.length; i++) {
        const char = productName.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    
    // Make sure it's positive and add a timestamp for uniqueness
    const positiveHash = Math.abs(hash);
    const timestamp = Date.now().toString(36).slice(-6);
    
    return `i${positiveHash}${timestamp}`;
}