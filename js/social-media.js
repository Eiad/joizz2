// Social Media Links Handler
document.addEventListener('DOMContentLoaded', function() {
    // Target both social links containers
    const footerSocialLinks = document.querySelector('.footer-column .social-links');
    const mobileSocialIcons = document.querySelector('.sidenav-contact .social-icons');
    
    // Load social media data once
    loadSocialMediaData().then(socialData => {
        // Update both locations with the same data
        if (footerSocialLinks) {
            updateSocialLinksContainer(footerSocialLinks, socialData, 'social-link');
        }
        
        if (mobileSocialIcons) {
            updateSocialLinksContainer(mobileSocialIcons, socialData, 'social-icon');
        }
    });
});

// Function to load social media data from API
async function loadSocialMediaData() {
    try {
        // Get social media links from API
        const response = await ContentService.getSocialMedia();
        
        if (response.success && response.data) {
            return response.data;
        } else {
            console.error('Failed to load social media links:', response.message);
            return null;
        }
    } catch (error) {
        console.error('Error loading social media links:', error);
        return null;
    }
}

// Function to update a social links container with data
function updateSocialLinksContainer(container, socialData, linkClassName) {
    if (!socialData) return;
    
    // Clear existing links
    container.innerHTML = '';
    
    // Add each social media link if available
    if (socialData.facebook) {
        addSocialLink(container, 'facebook', socialData.facebook, linkClassName);
    }
    
    if (socialData.instagram) {
        addSocialLink(container, 'instagram', socialData.instagram, linkClassName);
    }
    
    if (socialData.tiktok) {
        addSocialLink(container, 'tiktok', socialData.tiktok, linkClassName);
    }
    
    if (socialData.youtube) {
        addSocialLink(container, 'youtube', socialData.youtube, linkClassName);
    }
    
    if (socialData.snapchat) {
        addSocialLink(container, 'snapchat', socialData.snapchat, linkClassName);
    }
    
    if (socialData.X) {
        // For Twitter/X
        addSocialLink(container, 'twitter', socialData.X, linkClassName);
    }
    
    if (socialData.threads) {
        addSocialLink(container, 'threads', socialData.threads, linkClassName);
    }
    
    if (socialData.linkedin) {
        addSocialLink(container, 'linkedin', socialData.linkedin, linkClassName);
    }
    
    // Always add WhatsApp link for mobile nav
    if (container.classList.contains('social-icons')) {
        addSocialLink(container, 'whatsapp', 'https://wa.me/201067300073', linkClassName);
    }
}

// Helper function to add a social media link
function addSocialLink(container, platform, url, linkClassName) {
    if (!url) return;
    
    // Create link element
    const link = document.createElement('a');
    link.href = url;
    link.className = `${linkClassName} ${platform}`;
    link.target = '_blank'; // Open in new tab
    
    // Create icon element
    const icon = document.createElement('i');
    
    // Choose correct icon class based on platform
    switch (platform) {
        case 'facebook':
            icon.className = 'fab fa-facebook';
            break;
        case 'instagram':
            icon.className = 'fab fa-instagram';
            break;
        case 'tiktok':
            icon.className = 'fab fa-tiktok';
            break;
        case 'youtube':
            icon.className = 'fab fa-youtube';
            break;
        case 'snapchat':
            icon.className = 'fab fa-snapchat';
            break;
        case 'twitter': // For X/Twitter
            icon.className = 'fab fa-twitter';
            break;
        case 'threads':
            // Font Awesome might not have a threads icon, using a text fallback
            icon.className = 'fab fa-at'; // Using @ symbol as closest alternative
            break;
        case 'linkedin':
            icon.className = 'fab fa-linkedin';
            break;
        case 'whatsapp':
            icon.className = 'fab fa-whatsapp';
            break;
        default:
            icon.className = 'fab fa-link';
    }
    
    // Append icon to link
    link.appendChild(icon);
    
    // Append link to container
    container.appendChild(link);
}

// Function to load social media links
function loadSocialMedia() {
    // Get social media data from API (this part is likely already in your file)
    fetchSocialMedia()
        .then(data => {
            // Update footer social links (this part is likely already in your file)
            const footerSocialLinks = document.querySelector('.footer-column .social-links');
            if (footerSocialLinks) {
                // Your existing code for the footer
                renderSocialLinks(footerSocialLinks, data);
            }
            
            // Also update mobile navigation social links
            const mobileSocialIcons = document.querySelector('.mobile-sidenav .social-icons');
            if (mobileSocialIcons) {
                renderSocialLinks(mobileSocialIcons, data);
            }
        })
        .catch(error => {
            console.error('Error loading social media links:', error);
        });
}

// Helper function to render social links in a container
function renderSocialLinks(container, data) {
    container.innerHTML = '';
    
    if (data && data.length > 0) {
        data.forEach(item => {
            const link = document.createElement('a');
            link.href = item.url;
            link.target = '_blank';
            
            const icon = document.createElement('i');
            icon.className = `fab fa-${item.platform.toLowerCase()}`;
            
            link.appendChild(icon);
            container.appendChild(link);
        });
    }
}

// Load social media when page loads
document.addEventListener('DOMContentLoaded', loadSocialMedia); 