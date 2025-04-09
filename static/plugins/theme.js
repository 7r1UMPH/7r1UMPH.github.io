document.addEventListener('DOMContentLoaded', () => {
    // 设备检测函数（仅桌面生效）
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;
    if (!isDesktop()) {
        console.log('Mobile view detected, custom desktop styles not applied.');
        return;
    }

    // --- Configuration ---

    const currentPath = window.location.pathname;

    // Style Configuration (Consider using CSS Custom Properties for repeated values)
    const styleConfig = {
        // Common styles applied everywhere on desktop
        common: {
            // Base body styling
            'body': `
                min-width: 200px; /* Adjust min-width if necessary, 200px seems small */
                max-width: 885px;
                margin: 30px auto;
                font-size: 16px;
                font-family:
                    'Microsoft YaHei',   /* Windows */
                    'PingFang SC',      /* macOS */
                    'Noto Sans CJK SC', /* Linux/Android */
                    'WenQuanYi Micro Hei',
                    sans-serif;         /* Fallback */
                line-height: 1.25;
                background: rgba(237, 239, 233, 0.84);
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                /* Consider overflow carefully. 'auto' on body can sometimes interfere
                   with 'html' background attachment or cause double scrollbars.
                   Test thoroughly. */
                overflow: auto;
            `,
            // Sidenav styling
            '.SideNav': `
                background: rgba(255, 255, 255, 0.6);
                border-radius: 10px;
                min-width: unset; /* Explicitly override potential defaults */
            `,
            '.SideNav-item': `
                transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out, background-color 0.1s ease-in-out; /* Be specific */
            `,
            '.SideNav-item:hover': `
                background-color: #c3e4e3;
                border-radius: 10px; /* Already defined? Check if needed here */
                transform: scale(1.02);
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
            `,
            // Specific text styling (Fragile Selector - See comment below)
            // WARNING: Selecting based on inline styles is highly discouraged.
            // Prefer adding a dedicated CSS class to these divs in the HTML/template.
            // Example: <div class="special-text-block" style="margin-bottom: 16px">...</div>
            // Then target with: '.special-text-block'
            'div[style*="margin-bottom: 16px"]': `
                font-family:
                    'KaiTi',             /* Windows */
                    'STKaiti',           /* macOS */
                    'Noto Serif CJK SC', /* Linux (using Serif for KaiTi feel) */
                    'WenQuanYi Micro Hei',
                    serif;               /* Fallback */
                font-size: 1.4em;
                color: rgb(0, 0, 0);
                text-shadow:
                    2px 2px 4px rgba(107, 70, 70, 0.2),
                    -1px -1px 1px rgba(255, 255, 255, 0.5);
                letter-spacing: 0.1em;
                line-height: 1.8;
                /* Avoid !important if possible. If the inline style is exactly 'margin-bottom: 16px;',
                   this rule might override it due to specificity, but it's risky. */
                margin-bottom: 16px !important;
            `
        },
        // Home page specific styles
        home: {
            '#header': `
                height: 300px; /* Consider using min-height if content can vary */
            `,
            '#header h1': `
                position: absolute; /* Be careful with absolute positioning */
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                flex-direction: column;
                align-items: center;
                /* Ensure parent (#header) has position: relative or similar */
            `,
            '.avatar': `
                width: 200px;
                height: 200px;
            `,
            '#header h1 a': `
                margin-top: 30px;
                font-family: fantasy; /* Ensure this font is available or provide fallbacks */
                margin-left: unset; /* Explicitly override potential defaults */
            `
        },
        // Article/Post specific styles
        article: {
            '.markdown-body img': `
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.78);
                display: block; /* Often good for images */
                max-width: 100%; /* Make images responsive */
                height: auto;   /* Maintain aspect ratio */
            `,
            '.markdown-alert': `
                border-radius: 8px;
            `,
            '.markdown-body pre': `
                background-color: rgba(243, 244, 243, 0.967);
                box-shadow: 0 10px 30px 0 rgba(222, 217, 217, 0.4);
                padding: 15px 20px; /* Adjusted padding */
                border-radius: 8px;
                overflow-x: auto; /* Ensure code doesn't break layout */
            `,
            // Consider a more specific code style for inline vs block
            '.markdown-body code, .markdown-body tt': `
                background-color: #c9daf8; /* Check contrast ratio for accessibility */
                padding: 0.2em 0.4em;
                margin: 0;
                font-size: 85%;
                border-radius: 3px;
            `,
            // Consistent heading font
            '.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6': `
                font-family: 'KaiTi', 'STKaiti', 'Noto Serif CJK SC', 'WenQuanYi Micro Hei', cursive, sans-serif; /* Added fallbacks */
                margin-top: 1.5em; /* Standard heading spacing */
                margin-bottom: 0.8em;
                font-weight: 600; /* Typical heading weight */
            `,
            '.markdown-body h1': `
                display: inline-block; /* Or block if preferred */
                font-size: 1.8em; /* Use relative units */
                background: rgb(239, 112, 96);
                color: #ffffff;
                padding: 5px 12px; /* Adjusted padding */
                border-radius: 8px;
                /* margin: 1.8rem 2px 0 0; -> Replaced by common margin */
            `,
            '.markdown-body h2': `font-size: 1.5em;`,
            '.markdown-body h3': `font-size: 1.3em;`,
            '.markdown-body h4': `font-size: 1.1em;`,
            // Add h5, h6 if needed
        },
        // Page styles (page*.html) - Inherits common implicitly.
        // If specific page styles were needed, they would go here.
        page: {
            // Example: '.pagination': 'margin-top: 2em;'
        }
    };

    // --- Helper Functions ---

    /**
     * Generates a CSS string from a style configuration object.
     * Ensures each rule ends with a semicolon.
     * @param {object} styles - Object where keys are selectors and values are CSS rule strings.
     * @returns {string} - A single string containing all CSS rules.
     */
    const generateCSS = (styles) => {
        return Object.entries(styles)
            .map(([selector, rules]) => {
                // Trim whitespace and ensure the rule block ends with a semicolon
                const trimmedRules = rules.trim();
                const formattedRules = trimmedRules.endsWith(';') ? trimmedRules : `${trimmedRules};`;
                return `${selector} { ${formattedRules} }`;
            })
            .join('\n');
    };

    /**
     * Detects the current page type based on URL pathname.
     * @returns {string|undefined} - The detected page type ('home', 'article', 'page') or undefined if none match.
     */
    const getPageType = () => {
        // More specific regex patterns
        const routePatterns = [
            // Matches '/' or '/index.html' at the end of the path
            { type: 'home', pattern: /^(\/|\/index\.html)$/ },
            // Matches '/post/', 'link.html', or 'about.html' anywhere in the path
            { type: 'article', pattern: /(\/post\/|link\.html|about\.html)/ },
            // Matches '/page' followed by one or more digits and '.html' at the end
            { type: 'page', pattern: /\/page\d+\.html$/ }
        ];
        // Find the first pattern that matches the current path
        const match = routePatterns.find(p => p.pattern.test(currentPath));
        return match?.type; // Return the type if found, otherwise undefined
    };

    // --- Main Logic ---

    /**
     * Applies the appropriate CSS styles based on the page type.
     * Merges common styles with page-specific styles and adds the global background.
     */
    const applyStyles = () => {
        const pageType = getPageType();
        console.log(`Detected page type: ${pageType || 'common'}`);

        // Start with common styles
        let mergedStyles = { ...styleConfig.common };

        // Add page-specific styles if a type is detected and exists in config
        if (pageType && styleConfig[pageType]) {
            mergedStyles = { ...mergedStyles, ...styleConfig[pageType] };
        }

        // Add the global HTML background style (moved from setBackground)
        mergedStyles['html'] = `
            background: url('https://cdn.jsdelivr.net/gh/7r1UMPH/7r1UMPH.github.io@main/static/image/20250320210716585.webp')
                no-repeat center center fixed;
            background-size: cover;
            /* Add smooth scrolling for better user experience */
            scroll-behavior: smooth;
        `;

        // Generate the final CSS string
        const cssString = generateCSS(mergedStyles);

        // Create and append the style tag
        if (cssString) {
            const styleTag = document.createElement('style');
            styleTag.textContent = cssString;
            document.head.appendChild(styleTag);
            console.log('Custom desktop styles applied.');
        } else {
            console.log('No styles to apply.');
        }
    };

    // Execute main logic
    applyStyles();

});
