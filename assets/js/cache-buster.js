/**
 * Universal Cache Buster - SGD Unique Blocks & Pavers
 * Copy this file to: assets/js/cache-buster.js
 * Update VERSION number on every deployment
 */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION - UPDATE THIS ON EVERY DEPLOY
    // ============================================
    var VERSION = "1.0.2"; // ← CHANGE THIS NUMBER WHEN YOU PUSH TO GITHUB

    // Function to add version to URLs
    function v(url) {
        if (!url) return url;
        // Skip external URLs and data URLs
        if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('//')) {
            return url;
        }
        var separator = url.includes('?') ? '&' : '?';
        // Don't add version if it already exists
        if (url.includes('v=')) return url;
        return url + separator + 'v=' + VERSION;
    }

    // ============================================
    // ADD CACHE CONTROL META TAGS
    // ============================================
    function addCacheControlMeta() {
        var head = document.head;
        
        var metaTags = [
            { 'http-equiv': 'Cache-Control', 'content': 'no-cache, no-store, must-revalidate' },
            { 'http-equiv': 'Pragma', 'content': 'no-cache' },
            { 'http-equiv': 'Expires', 'content': '0' }
        ];

        metaTags.forEach(function(tag) {
            var meta = document.createElement('meta');
            for (var key in tag) {
                meta.setAttribute(key, tag[key]);
            }
            head.appendChild(meta);
        });
    }

    // ============================================
    // VERSION ALL RESOURCES
    // ============================================
    function versionResources() {
        // Version all CSS links
        document.querySelectorAll('link[rel="stylesheet"]').forEach(function(el) {
            if (el.href && !el.href.includes('v=')) {
                el.href = v(el.href);
            }
        });

        // Version all favicon links
        document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').forEach(function(el) {
            if (el.href && !el.href.includes('v=')) {
                el.href = v(el.href);
            }
        });

        // Version all images with data-version attribute
        document.querySelectorAll('img[data-version="true"]').forEach(function(el) {
            if (el.src && !el.src.includes('v=')) {
                el.src = v(el.src);
            }
        });

        // Version all images that are in assets/img/ (without data-version)
        document.querySelectorAll('img[src*="assets/img/"]').forEach(function(el) {
            if (el.src && !el.src.includes('v=') && !el.src.includes('data:')) {
                el.src = v(el.src);
            }
        });

        // Version all script tags (except this script itself)
        document.querySelectorAll('script[src]').forEach(function(el) {
            if (el.src && !el.src.includes('v=') && !el.src.includes('cache-buster.js')) {
                el.src = v(el.src);
            }
        });

        // Version background images in inline styles
        document.querySelectorAll('[style*="url("]').forEach(function(el) {
            var style = el.getAttribute('style');
            var newStyle = style.replace(/url\((['"]?)([^'"]+?)\1\)/g, function(match, quote, url) {
                url = url.trim();
                if (!url.includes('v=') && !url.startsWith('data:') && !url.startsWith('http')) {
                    return 'url(' + quote + v(url) + quote + ')';
                }
                return match;
            });
            if (newStyle !== style) {
                el.setAttribute('style', newStyle);
            }
        });
    }

    // ============================================
    // CLEAR SERVICE WORKER CACHE
    // ============================================
    function clearServiceWorkerCache() {
        if ('caches' in window) {
            caches.keys().then(function(names) {
                names.forEach(function(name) {
                    caches.delete(name);
                });
            });
        }
    }

    // ============================================
    // INITIALIZE
    // ============================================
    function init() {
        // Add cache control meta tags
        addCacheControlMeta();

        // Version all resources
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', versionResources);
        } else {
            versionResources();
        }

        // Clear service worker cache on new version
        var storedVersion = localStorage.getItem('SGD_VERSION');
        if (storedVersion !== VERSION) {
            clearServiceWorkerCache();
            localStorage.setItem('SGD_VERSION', VERSION);
        }

        console.log('🚀 SGD Cache Buster v' + VERSION + ' loaded');
    }

    // Run
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();