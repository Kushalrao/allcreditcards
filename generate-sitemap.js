import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base URL - update this if you have a custom domain
// Using HTTPS as Google Search Console prefers secure URLs
const BASE_URL = 'https://www.firstcredit.club';

// Get current date in ISO format for lastmod
const currentDate = new Date().toISOString().split('T')[0];

// Function to generate sitemap.xml
function generateSitemap() {
    const cardsDir = path.join(__dirname, 'cards');
    
    // Start sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add main index page
    sitemap += `  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;

    // Read all HTML files from cards directory
    const cardFiles = fs.readdirSync(cardsDir)
        .filter(file => file.endsWith('.html'))
        .sort(); // Sort alphabetically for consistency

    console.log(`Found ${cardFiles.length} card pages`);

    // Add each card page
    cardFiles.forEach(file => {
        // Filenames are already URL-safe (hyphens only), so use as-is
        const cardPath = `/cards/${file}`;
        sitemap += `  <url>
    <loc>${BASE_URL}${cardPath}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    // Add category pages
    const categoryPages = [
        'best-travel-cards',
        'top-cashback-cards',
        'premium-cards',
        'lifetime-free-cards',
        'best-overall-cards-2025'
    ];
    
    categoryPages.forEach(slug => {
        sitemap += `  <url>
    <loc>${BASE_URL}/${slug}.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
`;
    });

    // Add comparison pages
    const comparisonPages = [
        'hdfc-infinia-vs-axis-magnus',
        'top-5-travel-cards-comparison',
        'best-cashback-cards-comparison'
    ];
    
    comparisonPages.forEach(slug => {
        sitemap += `  <url>
    <loc>${BASE_URL}/${slug}.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
`;
    });

    // Close sitemap
    sitemap += `</urlset>`;

    // Write sitemap.xml to root directory
    const sitemapPath = path.join(__dirname, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap, 'utf8');
    
    const totalUrls = 1 + cardFiles.length + categoryPages.length + comparisonPages.length;
    console.log(`✅ Sitemap generated successfully!`);
    console.log(`   Total URLs: ${totalUrls}`);
    console.log(`   - Homepage: 1`);
    console.log(`   - Card pages: ${cardFiles.length}`);
    console.log(`   - Category pages: ${categoryPages.length}`);
    console.log(`   - Comparison pages: ${comparisonPages.length}`);
    console.log(`   Saved to: ${sitemapPath}`);
    console.log(`   Sitemap URL: ${BASE_URL}/sitemap.xml`);
}

// Run the generator
try {
    generateSitemap();
} catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
}

