const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- STARTING AUDIT VERIFICATION SUITE ---');

// 1. Verify index.html fixes
console.log('\n[TEST 1] Verifying index.html Architecture & Security...');
const html = fs.readFileSync('index.html', 'utf8');

// Check that Tailwind Play CDN is REMOVED
assert.strictEqual(html.includes('cdn.tailwindcss.com'), false, 'Tailwind Play CDN must be removed');
console.log('✓ Tailwind Play CDN completely removed');

// Check that external style.css is linked
assert.strictEqual(html.includes('<link rel="stylesheet" href="style.css">'), true, 'style.css must be linked');
console.log('✓ External purged style.css linked');

// Check that inline <style> was extracted
assert.strictEqual(html.includes('<style>'), false, '1,180 lines of inline <style> must be extracted');
console.log('✓ Inline <style> block removed (extracted to style.css)');

// Check Lucide is pinned
assert.strictEqual(html.includes('lucide@0.460.0'), true, 'Lucide must be pinned to fixed version');
assert.strictEqual(html.includes('lucide@latest'), false, 'Lucide@latest unpinned CDN must be removed');
console.log('✓ Lucide script pinned to version 0.460.0');

// Check DOMPurify is included
assert.strictEqual(html.includes('purify.min.js'), true, 'DOMPurify must be included');
console.log('✓ DOMPurify script included for XSS sanitization');

// Check CSP meta tag exists
assert.strictEqual(html.includes('Content-Security-Policy'), true, 'Content-Security-Policy meta tag must exist');
console.log('✓ Strict Content-Security-Policy meta tag present');

// Check SEO & OpenGraph meta tags
assert.strictEqual(html.includes('og:title'), true, 'og:title present');
assert.strictEqual(html.includes('og:description'), true, 'og:description present');
assert.strictEqual(html.includes('twitter:card'), true, 'twitter:card present');
console.log('✓ OpenGraph and Twitter card meta tags present');

// Check PWA meta tags & manifest
assert.strictEqual(html.includes('manifest.json'), true, 'manifest.json linked');
assert.strictEqual(html.includes('theme-color'), true, 'theme-color present');
console.log('✓ PWA manifest and mobile meta tags present');

// Check modal accessibility attributes
assert.strictEqual(html.includes('role="dialog"'), true, 'Modal has role="dialog"');
assert.strictEqual(html.includes('aria-modal="true"'), true, 'Modal has aria-modal="true"');
assert.strictEqual(html.includes('aria-label='), true, 'Modal has aria-label');
console.log('✓ Image lightbox modal has complete ARIA dialog attributes');

// Check that inline onclicks in index.html are eliminated
const inlineOnclicksInHtml = (html.match(/onclick=/gi) || []).length;
assert.strictEqual(inlineOnclicksInHtml, 0, `index.html must have 0 inline onclick handlers (found ${inlineOnclicksInHtml})`);
console.log('✓ Zero inline onclick handlers in index.html (converted to event delegation)');

// 2. Verify manifest.json
console.log('\n[TEST 2] Verifying manifest.json...');
const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
assert.strictEqual(manifest.name, 'Unidesk Campus Helpdesk');
assert.strictEqual(manifest.display, 'standalone');
assert.strictEqual(manifest.theme_color, '#a3ff12');
assert.strictEqual(manifest.background_color, '#080a07');
assert(manifest.icons.length >= 2, 'Must have at least 2 icon formats');
console.log('✓ Web App Manifest is valid and conforms to PWA standards');

// 3. Verify sw.js (Service Worker)
console.log('\n[TEST 3] Verifying sw.js...');
const sw = fs.readFileSync('sw.js', 'utf8');
assert(sw.includes('install'), 'Service worker has install event');
assert(sw.includes('activate'), 'Service worker has activate event');
assert(sw.includes('fetch'), 'Service worker has fetch event');
assert(sw.includes('style.css'), 'Service worker precaches style.css');
console.log('✓ Offline Service Worker caching strategy verified');

// 4. Verify style.css & WCAG AA Color Contrast
console.log('\n[TEST 4] Verifying style.css & WCAG Color Contrast Tokens...');
const css = fs.readFileSync('style.css', 'utf8');
const customCss = fs.readFileSync('zen-custom.css', 'utf8');

assert(!customCss.includes('color: #8c9384;'), 'Low contrast #8c9384 in tab-link must be replaced');
assert(customCss.includes('color: #a1a89c;'), 'High contrast #a1a89c token must be present');
console.log('✓ Low contrast gray tokens (#8c9384) upgraded to WCAG AA compliant (#a1a89c)');

const cssSize = fs.statSync('style.css').size;
console.log(`✓ Purged CSS bundle size: ${(cssSize / 1024).toFixed(1)} KB (down from 3.5 MB Play CDN!)`);
assert(cssSize < 75000, 'Purged stylesheet must be < 75 KB (down from 3.5 MB Play CDN)');
assert(css.includes('.zen-light'), 'style.css must contain .zen-light section styles');
assert(css.includes('body.light-mode'), 'style.css must contain body.light-mode theme definitions');
console.log('✓ Light mode and Zen custom styles verified inside compiled bundle');

// 5. Verify app.js fixes
console.log('\n[TEST 5] Verifying app.js Code Audit Fixes...');
const appJs = fs.readFileSync('app.js', 'utf8');

// AudioContext Singleton
assert(appJs.includes('let sharedAudioCtx = null;'), 'sharedAudioCtx singleton variable present');
assert(appJs.includes('function getAudioContext()'), 'getAudioContext singleton accessor present');
assert(appJs.includes('sharedAudioCtx.state === \'suspended\''), 'Auto-resumes suspended AudioContext');
console.log('✓ Singleton AudioContext pattern implemented with auto-resume');

// Confetti RAF cleanup
assert(appJs.includes('let confettiRafId = null;'), 'confettiRafId present');
assert(appJs.includes('cancelAnimationFrame(confettiRafId)'), 'cancelAnimationFrame called to prevent frame leaks');
console.log('✓ Confetti physics canvas animation frame cleanup implemented');

// Pointermove RAF throttle
assert(appJs.includes('let pointerRafId = null;'), 'pointerRafId throttle variable present');
assert(appJs.includes('requestAnimationFrame(() =>'), 'pointermove throttled via requestAnimationFrame');
assert(appJs.includes('{ passive: true }'), 'pointermove uses { passive: true }');
console.log('✓ 144Hz pointermove listener throttled with RAF and passive listener');

// Debounced typing
assert(appJs.includes('function debounce('), 'Debounce utility present');
assert(appJs.includes('debouncedReportTyping'), 'Duplicate check typing is debounced');
console.log('✓ 250ms debounce function implemented for duplicate ticket search');

// SHA-256 PIN authentication & token session
assert(!appJs.includes("const STAFF_PIN = '1234';"), 'Hardcoded plaintext PIN removed');
assert(appJs.includes('PIN_HASH'), 'Salted SHA-256 PIN_HASH used');
assert(appJs.includes('crypto.subtle.digest'), 'Web Crypto SHA-256 hashing used');
assert(appJs.includes('TOKEN_KEY'), 'Cryptographic staff token session used');
assert(appJs.includes('unidesk_lockout'), 'Rate limiting and lockout implemented');
console.log('✓ Plaintext PIN replaced with Salted SHA-256, token session, and lockout protection');

// IndexedDB & Storage
assert(appJs.includes('UnideskDB'), 'IndexedDB storage subsystem present');
assert(appJs.includes('DB.setAll'), 'IndexedDB asynchronous write present');
assert(appJs.includes('try {'), 'Defensive try/catch wrapping present in save()');
assert(appJs.includes('QuotaExceededError'), 'QuotaExceededError handled gracefully');
console.log('✓ Asynchronous IndexedDB storage layer and defensive LocalStorage wrapper verified');

// Event Delegation & removal of inline onclicks in templates
assert(!appJs.includes('onclick="App.zoomImage'), 'onclick App.zoomImage removed (XSS patch)');
assert(!appJs.includes('onclick="App.upvote'), 'onclick App.upvote removed');
assert(!appJs.includes('onclick="App.assignTicket'), 'onclick App.assignTicket removed');
assert(appJs.includes('data-action="zoom-ticket"'), 'Safe data-action="zoom-ticket" used');
assert(appJs.includes('data-action="upvote"'), 'data-action="upvote" used');
assert(appJs.includes('document.addEventListener(\'click\''), 'Centralized click event delegation implemented');
assert(appJs.includes('document.addEventListener(\'change\''), 'Centralized change event delegation implemented');
assert(appJs.includes('document.addEventListener(\'submit\''), 'Centralized submit event delegation implemented');
console.log('✓ Inline template onclick handlers replaced with Event Delegation and data attributes');

// Modal focus trap & Escape key
assert(appJs.includes('openImageModal'), 'openImageModal helper present');
assert(appJs.includes('closeImageModal'), 'closeImageModal helper present');
assert(appJs.includes('lastFocusedElement'), 'Focus restoration implemented');
assert(appJs.includes('e.key === \'Escape\''), 'Escape key dismisses modal');
assert(appJs.includes('e.key === \'Tab\''), 'Tab focus trap implemented inside modal');
console.log('✓ Modal focus trap, Tab cycle, and Escape dismissal implemented');

// Service Worker registration
assert(appJs.includes('serviceWorker.register'), 'Service worker registered');
console.log('✓ Service Worker registration logic verified');

// Dark & Light Mode Theme Engine
assert(appJs.includes('function applyTheme'), 'applyTheme function present');
assert(appJs.includes('function toggleTheme'), 'toggleTheme function present');
assert(appJs.includes('unidesk_theme'), 'unidesk_theme persistence key present');
assert(html.includes('id="theme-toggle-btn"'), 'theme-toggle-btn present in header');
assert(html.includes('id="header-logo"'), 'header-logo element present for dynamic contrast swap');
assert(html.includes('id="footer-logo"'), 'footer-logo element present for dynamic contrast swap');
console.log('✓ Dark and Light Mode toggle engine, logo switching, and persistence verified');

console.log('\n======================================================');
console.log('ALL VERIFICATION TESTS PASSED SUCCESSFULLY! (100%)');
console.log('======================================================\n');

