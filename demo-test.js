// Profile Settings Demo Test Script
// Run this in the browser console after opening localhost:3000

console.log('🧪 Personal Finance Profile Settings Test Script');
console.log('========================================');

// Function to setup demo user
function setupDemoUser() {
    console.log('🔧 Setting up demo user...');
    
    // Set demo token in localStorage
    localStorage.setItem('personalfinance_token', 'demo_token_123');
    
    // Set demo user data
    const demoUser = {
        id: 999,
        username: 'demo',
        email: 'demo@personalfinance.com',
        firstName: 'Demo',
        lastName: 'User',
        phoneNumber: '+1-555-0123',
        avatarUrl: '',
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('personalfinance_user', JSON.stringify(demoUser));
    
    console.log('✅ Demo user setup complete!');
    console.log('📧 Email: demo@personalfinance.com');
    console.log('🔑 Password: demo123');
    console.log('🎟️  Token: demo_token_123');
    
    return demoUser;
}

// Function to test Profile API calls
async function testProfileAPIs() {
    console.log('🧪 Testing Profile APIs...');
    
    // Test get profile
    try {
        const response = await fetch('/api/users/profile', {
            headers: {
                'Authorization': 'Bearer demo_token_123',
                'Content-Type': 'application/json'
            }
        });
        
        console.log('📡 Profile API Response:', response.status);
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Profile data:', data);
        } else {
            console.log('⚠️  Profile API not available, using fallback');
        }
    } catch (error) {
        console.log('⚠️  Profile API error:', error.message);
    }
}

// Function to check current page
function checkCurrentPage() {
    const path = window.location.pathname;
    console.log('📍 Current page:', path);
    
    if (path === '/profile') {
        console.log('✅ On Profile page - ready for testing!');
        return true;
    } else {
        console.log('❌ Not on Profile page. Navigate to: /profile');
        return false;
    }
}

// Function to test all Profile features
function testProfileFeatures() {
    console.log('🔍 Testing Profile page features...');
    
    // Check if tabs exist
    const tabs = document.querySelectorAll('[role="tab"]');
    console.log(`📁 Found ${tabs.length} tabs:`, Array.from(tabs).map(tab => tab.textContent));
    
    // Check for profile form
    const profileForm = document.querySelector('form');
    if (profileForm) {
        console.log('✅ Profile form found');
    } else {
        console.log('❌ Profile form not found');
    }
    
    // Check for avatar upload
    const avatarInput = document.querySelector('input[type="file"]');
    if (avatarInput) {
        console.log('✅ Avatar upload input found');
    } else {
        console.log('❌ Avatar upload input not found');
    }
    
    // Check for preferences switches
    const switches = document.querySelectorAll('[role="switch"]');
    console.log(`🎛️  Found ${switches.length} preference switches`);
    
    return {
        tabs: tabs.length,
        hasForm: !!profileForm,
        hasAvatarUpload: !!avatarInput,
        switches: switches.length
    };
}

// Auto-run setup
console.log('🚀 Auto-running demo setup...');
setupDemoUser();

// Check if we're on the right page
const onProfilePage = checkCurrentPage();

if (onProfilePage) {
    // Wait a moment for React to render, then test
    setTimeout(() => {
        const results = testProfileFeatures();
        console.log('📊 Test Results:', results);
        
        if (results.tabs >= 4 && results.hasForm) {
            console.log('🎉 Profile page looks good! You can now test:');
            console.log('   1. Edit profile information');
            console.log('   2. Upload an avatar image');
            console.log('   3. Toggle preferences switches');
            console.log('   4. Change password (current: demo123)');
        }
    }, 2000);
}

// Helper functions for manual testing
window.demoTest = {
    setup: setupDemoUser,
    testAPIs: testProfileAPIs,
    checkPage: checkCurrentPage,
    testFeatures: testProfileFeatures,
    
    // Quick navigation helper
    goToProfile: () => {
        window.location.href = '/profile';
    },
    
    // Clear demo data
    clearDemo: () => {
        localStorage.removeItem('personalfinance_token');
        localStorage.removeItem('personalfinance_user');
        console.log('🧹 Demo data cleared');
    }
};

console.log('✨ Demo test utilities available as window.demoTest');
console.log('📋 Usage: demoTest.setup(), demoTest.testFeatures(), etc.');
