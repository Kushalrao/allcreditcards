import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base URL - update this if you have a custom domain
const BASE_URL = 'https://allcreditcards.vercel.app';

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
        const cardPath = `/cards/${file}`;
        sitemap += `  <url>
    <loc>${BASE_URL}${cardPath}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    // Close sitemap
    sitemap += `</urlset>`;

    // Write sitemap.xml to root directory
    const sitemapPath = path.join(__dirname, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap, 'utf8');
    
    console.log(`✅ Sitemap generated successfully!`);
    console.log(`   Total URLs: ${cardFiles.length + 1}`);
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

