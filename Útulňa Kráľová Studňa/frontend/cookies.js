// Cookie Consent Management
(function() {
    'use strict';

    const COOKIE_CONSENT_KEY = 'cookie_consent';
    const COOKIE_PREFERENCES_KEY = 'cookie_preferences';

    // Cookie categories
    const COOKIE_CATEGORIES = {
        necessary: {
            name: 'Nevyhnutné',
            description: 'Tieto cookies sú nevyhnutné pre fungovanie stránky a nemožno ich vypnúť. Obsahujú session cookies pre prihlásenie.',
            required: true
        },
        functional: {
            name: 'Funkčné',
            description: 'Tieto cookies umožňujú stránke zapamätať si vaše preferencie a poskytovať vylepšené funkcie.',
            required: false
        },
        analytics: {
            name: 'Analytické',
            description: 'Tieto cookies nám pomáhajú pochopiť, ako návštevníci používajú stránku, aby sme ju mohli zlepšovať.',
            required: false
        }
    };

    // Get cookie preferences from localStorage
    function getCookiePreferences() {
        const stored = localStorage.getItem(COOKIE_PREFERENCES_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    // Save cookie preferences to localStorage
    function saveCookiePreferences(preferences) {
        localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences));
        localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    }

    // Check if user has given consent
    function hasConsent() {
        return localStorage.getItem(COOKIE_CONSENT_KEY) === 'true';
    }

    // Initialize default preferences (only necessary cookies enabled)
    function getDefaultPreferences() {
        const prefs = {};
        Object.keys(COOKIE_CATEGORIES).forEach(key => {
            prefs[key] = COOKIE_CATEGORIES[key].required;
        });
        return prefs;
    }

    // Create cookie consent banner
    function createCookieBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-consent-content">
                <div class="cookie-consent-text">
                    <h3>Používanie cookies</h3>
                    <p>Táto stránka používa cookies na zlepšenie vášho zážitku. Niektoré cookies sú nevyhnutné pre fungovanie stránky, iné nám pomáhajú analyzovať návštevnosť a prispôsobiť obsah.</p>
                    <p><a href="ochrana-osobnych-udajov.html" target="_blank">Viac informácií o ochrane osobných údajov</a></p>
                </div>
                <div class="cookie-consent-buttons">
                    <button id="cookie-accept-all" class="btn-cookie-accept">Prijať všetko</button>
                    <button id="cookie-settings" class="btn-cookie-settings">Nastavenia</button>
                    <button id="cookie-reject-optional" class="btn-cookie-reject">Odmietnuť voliteľné</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);

        // Event listeners
        document.getElementById('cookie-accept-all').addEventListener('click', () => {
            const prefs = {};
            Object.keys(COOKIE_CATEGORIES).forEach(key => {
                prefs[key] = true;
            });
            saveCookiePreferences(prefs);
            hideBanner();
        });

        document.getElementById('cookie-reject-optional').addEventListener('click', () => {
            const prefs = getDefaultPreferences();
            saveCookiePreferences(prefs);
            hideBanner();
        });

        document.getElementById('cookie-settings').addEventListener('click', () => {
            showCookieSettings();
        });
    }

    // Show cookie settings modal
    function showCookieSettings() {
        const modal = document.createElement('div');
        modal.id = 'cookie-settings-modal';
        modal.className = 'cookie-settings-modal';
        
        const prefs = getCookiePreferences() || getDefaultPreferences();
        
        let categoriesHtml = '';
        Object.keys(COOKIE_CATEGORIES).forEach(key => {
            const category = COOKIE_CATEGORIES[key];
            const isChecked = prefs[key] || false;
            const disabled = category.required ? 'disabled' : '';
            
            categoriesHtml += `
                <div class="cookie-category">
                    <div class="cookie-category-header">
                        <label class="cookie-toggle">
                            <input type="checkbox" id="cookie-${key}" ${isChecked ? 'checked' : ''} ${disabled}>
                            <span class="cookie-toggle-slider"></span>
                        </label>
                        <div class="cookie-category-info">
                            <h4>${category.name}${category.required ? ' <span class="required-badge">(Nevyhnutné)</span>' : ''}</h4>
                            <p>${category.description}</p>
                        </div>
                    </div>
                </div>
            `;
        });

        modal.innerHTML = `
            <div class="cookie-settings-overlay"></div>
            <div class="cookie-settings-content">
                <div class="cookie-settings-header">
                    <h2>Nastavenia cookies</h2>
                    <button class="cookie-settings-close" id="cookie-settings-close">&times;</button>
                </div>
                <div class="cookie-settings-body">
                    <p>Vyberte, ktoré cookies chcete povoliť. Nevyhnutné cookies nemožno vypnúť, pretože sú potrebné pre základné funkcie stránky.</p>
                    ${categoriesHtml}
                </div>
                <div class="cookie-settings-footer">
                    <button id="cookie-save-settings" class="btn-cookie-save">Uložiť nastavenia</button>
                    <button id="cookie-accept-all-modal" class="btn-cookie-accept">Prijať všetko</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);

        // Event listeners
        document.getElementById('cookie-settings-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.querySelector('.cookie-settings-overlay').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.getElementById('cookie-save-settings').addEventListener('click', () => {
            const newPrefs = {};
            Object.keys(COOKIE_CATEGORIES).forEach(key => {
                const checkbox = document.getElementById(`cookie-${key}`);
                newPrefs[key] = checkbox.checked || COOKIE_CATEGORIES[key].required;
            });
            saveCookiePreferences(newPrefs);
            document.body.removeChild(modal);
            hideBanner();
        });

        document.getElementById('cookie-accept-all-modal').addEventListener('click', () => {
            const prefs = {};
            Object.keys(COOKIE_CATEGORIES).forEach(key => {
                prefs[key] = true;
            });
            saveCookiePreferences(prefs);
            document.body.removeChild(modal);
            hideBanner();
        });
    }

    // Hide cookie banner
    function hideBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.style.display = 'none';
        }
    }

    // Initialize cookie consent
    function initCookieConsent() {
        if (!hasConsent()) {
            createCookieBanner();
        }
    }

    // Public API
    window.CookieConsent = {
        hasConsent: hasConsent,
        getPreferences: getCookiePreferences,
        hasCategory: function(category) {
            const prefs = getCookiePreferences() || getDefaultPreferences();
            return prefs[category] === true;
        },
        showSettings: showCookieSettings,
        init: initCookieConsent
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookieConsent);
    } else {
        initCookieConsent();
    }
})();
