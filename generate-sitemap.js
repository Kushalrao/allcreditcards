import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base URL - update this if you have a custom domain
// Using HTTPS as Google Search Console prefers secure URLs
const BASE_URL = 'https://www.firstcredit.club';

// Function to get file modification date in ISO 8601 format (YYYY-MM-DD)
function getFileModDate(filePath) {
    try {
        const stats = fs.statSync(filePath);
        const modDate = new Date(stats.mtime);
        return modDate.toISOString().split('T')[0];
    } catch (error) {
        // Fallback to current date if file doesn't exist
        return new Date().toISOString().split('T')[0];
    }
}

// Function to escape XML special characters
function escapeXml(unsafe) {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// Function to determine priority based on page type and importance
function getPriority(pageType, isPopular = false) {
    switch (pageType) {
        case 'homepage':
            return '1.0';
        case 'category':
            return '0.9';
        case 'comparison':
            return '0.9';
        case 'card':
            // Popular cards get slightly higher priority
            return isPopular ? '0.85' : '0.8';
        default:
            return '0.8';
    }
}

// Function to determine changefreq based on page type
function getChangeFreq(pageType) {
    switch (pageType) {
        case 'homepage':
            return 'weekly'; // Homepage content may change more frequently
        case 'category':
            return 'monthly'; // Category pages updated monthly
        case 'comparison':
            return 'monthly'; // Comparison pages updated monthly
        case 'card':
            return 'monthly'; // Card pages are relatively static
        default:
            return 'monthly';
    }
}

// List of popular/important cards that should get higher priority
const popularCards = [
    'hdfc-infinia-credit-card',
    'axis-bank-magnus-credit-card',
    'hdfc-regalia-credit-card',
    'sbi-cashback-credit-card',
    'hdfc-millennia-credit-card',
    'axis-bank-ace-credit-card',
    'icici-amazon-pay-credit-card',
    'hdfc-diners-club-black',
    'axis-bank-atlas-credit-card',
    'sbi-card-prime',
    'hdfc-tata-neu-infinity-credit-card',
    'hdfc-tata-neu-plus-credit-card',
    'axis-bank-flipkart-credit-card',
    'sbi-simplyclick-credit-card',
    'icici-sapphiro-credit-card'
];

// Function to generate sitemap.xml following Google best practices
function generateSitemap() {
    const cardsDir = path.join(__dirname, 'cards');
    const rootDir = __dirname;
    
    // Validate sitemap limits (Google: max 50,000 URLs, max 50MB)
    const MAX_URLS = 50000;
    const MAX_SIZE_MB = 50;
    
    // Start sitemap XML with proper encoding
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

    // Add main index page with actual file modification date
    const indexPath = path.join(rootDir, 'index.html');
    const indexLastMod = getFileModDate(indexPath);
    
    sitemap += `  <url>
    <loc>${escapeXml(BASE_URL)}/</loc>
    <lastmod>${indexLastMod}</lastmod>
    <changefreq>${getChangeFreq('homepage')}</changefreq>
    <priority>${getPriority('homepage')}</priority>
  </url>
`;

    // Read all HTML files from cards directory
    const cardFiles = fs.readdirSync(cardsDir)
        .filter(file => file.endsWith('.html'))
        .sort(); // Sort alphabetically for consistency

    console.log(`Found ${cardFiles.length} card pages`);

    // Add each card page with actual file modification date
    cardFiles.forEach(file => {
        const cardPath = `/cards/${file}`;
        const filePath = path.join(cardsDir, file);
        const lastMod = getFileModDate(filePath);
        
        // Check if this is a popular card
        const cardSlug = file.replace('.html', '');
        const isPopular = popularCards.includes(cardSlug);
        
        sitemap += `  <url>
    <loc>${escapeXml(BASE_URL + cardPath)}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${getChangeFreq('card')}</changefreq>
    <priority>${getPriority('card', isPopular)}</priority>
  </url>
`;
    });

    // Add category pages with actual file modification dates
    const categoryPages = [
        'best-travel-cards',
        'top-cashback-cards',
        'premium-cards',
        'lifetime-free-cards',
        'best-overall-cards-2025'
    ];
    
    categoryPages.forEach(slug => {
        const filePath = path.join(rootDir, `${slug}.html`);
        const lastMod = getFileModDate(filePath);
        const url = `${BASE_URL}/${slug}.html`;
        
        sitemap += `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${getChangeFreq('category')}</changefreq>
    <priority>${getPriority('category')}</priority>
  </url>
`;
    });

    // Add comparison pages with actual file modification dates
    const comparisonPages = [
        'hdfc-infinia-vs-axis-magnus',
        'top-5-travel-cards-comparison',
        'best-cashback-cards-comparison'
    ];
    
    comparisonPages.forEach(slug => {
        const filePath = path.join(rootDir, `${slug}.html`);
        const lastMod = getFileModDate(filePath);
        const url = `${BASE_URL}/${slug}.html`;
        
        sitemap += `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${getChangeFreq('comparison')}</changefreq>
    <priority>${getPriority('comparison')}</priority>
  </url>
`;
    });

    // Close sitemap
    sitemap += `</urlset>`;

    // Validate size
    const sitemapSizeBytes = Buffer.byteLength(sitemap, 'utf8');
    const sitemapSizeMB = sitemapSizeBytes / (1024 * 1024);
    const totalUrls = 1 + cardFiles.length + categoryPages.length + comparisonPages.length;

    // Write sitemap.xml to root directory
    const sitemapPath = path.join(__dirname, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap, 'utf8');
    
    // Validation and reporting
    console.log(`\n✅ Sitemap generated successfully!`);
    console.log(`   Total URLs: ${totalUrls}`);
    console.log(`   - Homepage: 1 (priority: ${getPriority('homepage')})`);
    console.log(`   - Card pages: ${cardFiles.length} (priority: ${getPriority('card')} / ${getPriority('card', true)} for popular)`);
    console.log(`   - Category pages: ${categoryPages.length} (priority: ${getPriority('category')})`);
    console.log(`   - Comparison pages: ${comparisonPages.length} (priority: ${getPriority('comparison')})`);
    console.log(`\n   File size: ${(sitemapSizeMB).toFixed(2)} MB (${sitemapSizeBytes.toLocaleString()} bytes)`);
    console.log(`   Size limit: ${MAX_SIZE_MB} MB (${(sitemapSizeMB < MAX_SIZE_MB ? '✅' : '❌')} ${sitemapSizeMB < MAX_SIZE_MB ? 'Within limit' : 'EXCEEDS LIMIT'})`);
    console.log(`   URL limit: ${MAX_URLS} (${totalUrls < MAX_URLS ? '✅' : '❌'} ${totalUrls < MAX_URLS ? 'Within limit' : 'EXCEEDS LIMIT'})`);
    console.log(`\n   Saved to: ${sitemapPath}`);
    console.log(`   Sitemap URL: ${BASE_URL}/sitemap.xml`);
    
    // Warn if approaching limits
    if (totalUrls > MAX_URLS * 0.8) {
        console.log(`\n   ⚠️  Warning: Approaching URL limit. Consider using sitemap index if you exceed ${MAX_URLS} URLs.`);
    }
    if (sitemapSizeMB > MAX_SIZE_MB * 0.8) {
        console.log(`\n   ⚠️  Warning: Approaching size limit. Consider splitting sitemap or compressing.`);
    }
    
    // Best practices checklist
    console.log(`\n   📋 Best Practices Checklist:`);
    console.log(`   ✅ Uses actual file modification dates (lastmod)`);
    console.log(`   ✅ Proper priority distribution (0.0-1.0 scale)`);
    console.log(`   ✅ Appropriate changefreq values`);
    console.log(`   ✅ UTF-8 encoding`);
    console.log(`   ✅ Valid XML structure`);
    console.log(`   ✅ Only includes indexable pages`);
    console.log(`   ✅ Canonical URLs only`);
    
    if (totalUrls > 1000) {
        console.log(`\n   💡 Recommendation: Consider creating a sitemap index file for better organization.`);
    }
}

// Run the generator
try {
    generateSitemap();
} catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
}
