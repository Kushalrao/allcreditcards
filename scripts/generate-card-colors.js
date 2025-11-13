#!/usr/bin/env node

/**
 * Script to extract dominant colors from credit card images and persist them to cardColors.json.
 * Usage: `node scripts/generate-card-colors.js [--assets <path>] [--output <path>]`
 */

import fs from 'fs/promises';
import path from 'path';
import process from 'process';
import { performance } from 'node:perf_hooks';
import sharp from 'sharp';

const DEFAULT_ASSETS_DIR = path.resolve(process.cwd(), 'Assets');
const DEFAULT_OUTPUT_PATH = path.resolve(process.cwd(), 'cardColors.json');

function parseArgs(argv) {
    const args = {
        assetsDir: DEFAULT_ASSETS_DIR,
        outputPath: DEFAULT_OUTPUT_PATH,
    };

    for (let i = 2; i < argv.length; i += 1) {
        const arg = argv[i];
        if ((arg === '--assets' || arg === '-a') && argv[i + 1]) {
            args.assetsDir = path.resolve(process.cwd(), argv[i + 1]);
            i += 1;
        } else if ((arg === '--output' || arg === '-o') && argv[i + 1]) {
            args.outputPath = path.resolve(process.cwd(), argv[i + 1]);
            i += 1;
        } else if (arg === '--help' || arg === '-h') {
            printHelp();
            process.exit(0);
        } else {
            console.warn(`Unknown argument "${arg}" ignored.`);
        }
    }

    return args;
}

function printHelp() {
    console.log(`
Generate dominant colors for credit card images.

Options:
  --assets, -a <path>   Path to the card image assets directory (default: ./Assets)
  --output, -o <path>   Path to the output JSON file (default: ./cardColors.json)
  --help,   -h          Show this help message
`);
}

function toHex(value) {
    return value.toString(16).padStart(2, '0');
}

function rgbToHex(r, g, b) {
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function getHue(r, g, b) {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;

    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const delta = max - min;

    if (delta === 0) return 0;

    let hue;
    if (max === rn) {
        hue = ((gn - bn) / delta) % 6;
    } else if (max === gn) {
        hue = (bn - rn) / delta + 2;
    } else {
        hue = (rn - gn) / delta + 4;
    }

    hue *= 60;
    if (hue < 0) {
        hue += 360;
    }

    return hue;
}

function getLightness(r, g, b) {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    return (max + min) / 2;
}

function getSaturation(r, g, b) {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const delta = max - min;

    if (delta === 0) return 0;

    const lightness = (max + min) / 2;
    return delta / (1 - Math.abs(2 * lightness - 1));
}

function classifyColorFamily({ r, g, b }) {
    const lightness = getLightness(r, g, b);
    const saturation = getSaturation(r, g, b);
    const hue = getHue(r, g, b);

    if (lightness <= 0.1) return 'Black';
    if (lightness >= 0.92) return 'White';
    if (saturation < 0.12) return 'Gray';

    // Browns: low saturation & medium lightness with more red/green
    if (lightness < 0.55 && hue >= 10 && hue < 50 && saturation < 0.5) {
        return 'Brown';
    }

    if (hue < 15 || hue >= 345) return 'Red';
    if (hue < 40) return 'Orange';
    if (hue < 65) return 'Yellow';
    if (hue < 90) return 'Lime';
    if (hue < 150) return 'Green';
    if (hue < 180) return 'Teal';
    if (hue < 210) return 'Cyan';
    if (hue < 255) return 'Blue';
    if (hue < 285) return 'Indigo';
    if (hue < 320) return 'Purple';
    return 'Pink';
}

function sortAndFormatPalette(bins) {
    const sorted = Array.from(bins.values())
        .filter((entry) => entry.count > 0)
        .sort((a, b) => b.count - a.count);

    const palette = sorted.slice(0, 6).map((entry) => {
        const r = Math.round(entry.rSum / entry.count);
        const g = Math.round(entry.gSum / entry.count);
        const b = Math.round(entry.bSum / entry.count);
        return {
            rgb: { r, g, b },
            hex: rgbToHex(r, g, b),
            population: entry.count,
        };
    });

    return palette;
}

async function extractDominantColors(imagePath) {
    const { data, info } = await sharp(imagePath)
        .ensureAlpha()
        .resize({
            width: 200,
            height: 200,
            fit: sharp.fit.inside,
            withoutEnlargement: true,
        })
        .raw()
        .toBuffer({ resolveWithObject: true });

    const bins = new Map();
    const stride = info.channels;

    for (let i = 0; i < data.length; i += stride) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = stride === 4 ? data[i + 3] : 255;

        if (a < 160) continue; // ignore mostly transparent pixels

        // Skip near-white and near-black pixels to reduce background dominance
        const maxChannel = Math.max(r, g, b);
        const minChannel = Math.min(r, g, b);
        if (maxChannel > 245 && minChannel > 220) continue; // almost white
        if (maxChannel < 15 && minChannel < 15) continue; // almost black

        // Quantize to 16x16x16 cube to keep bins reasonable
        const key = `${r >> 4}-${g >> 4}-${b >> 4}`;
        if (!bins.has(key)) {
            bins.set(key, { count: 0, rSum: 0, gSum: 0, bSum: 0 });
        }

        const entry = bins.get(key);
        entry.count += 1;
        entry.rSum += r;
        entry.gSum += g;
        entry.bSum += b;
    }

    if (bins.size === 0) {
        const fallbackRgb = { r: 128, g: 128, b: 128 };
        return {
            dominant: { hex: rgbToHex(128, 128, 128), rgb: fallbackRgb, family: 'Gray' },
            palette: [],
        };
    }

    const palette = sortAndFormatPalette(bins);
    const dominant = palette[0];

    return {
        dominant: {
            hex: dominant.hex,
            rgb: dominant.rgb,
            family: classifyColorFamily(dominant.rgb),
        },
        palette: palette.slice(1).map((entry) => entry.hex),
    };
}

async function generateCardColors({ assetsDir, outputPath }) {
    const start = performance.now();

    const entries = await fs.readdir(assetsDir, { withFileTypes: true });
    const cardImages = entries
        .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.png'))
        .map((entry) => entry.name)
        .sort((a, b) => a.localeCompare(b));

    if (cardImages.length === 0) {
        throw new Error(`No PNG images found in assets directory: ${assetsDir}`);
    }

    const results = {};
    const familyCounts = new Map();

    for (const filename of cardImages) {
        const imagePath = path.join(assetsDir, filename);
        try {
            const { dominant, palette } = await extractDominantColors(imagePath);
            results[filename] = {
                dominantHex: dominant.hex,
                colorFamily: dominant.family,
                palette,
            };

            if (dominant.family) {
                familyCounts.set(dominant.family, (familyCounts.get(dominant.family) || 0) + 1);
            }
        } catch (error) {
            console.error(`Failed to process "${filename}": ${error.message}`);
        }
    }

    const output = {
        generatedAt: new Date().toISOString(),
        assetsDir: path.relative(process.cwd(), assetsDir) || '.',
        totalCards: Object.keys(results).length,
        colorFamilies: Object.fromEntries(Array.from(familyCounts.entries()).sort((a, b) => b[1] - a[1])),
        cards: results,
    };

    await fs.writeFile(outputPath, JSON.stringify(output, null, 2), 'utf8');

    const durationMs = (performance.now() - start).toFixed(2);
    console.log(`Processed ${output.totalCards} images in ${durationMs} ms.`);
    console.log(`Color families detected: ${Array.from(familyCounts.keys()).join(', ') || 'none'}`);
    console.log(`Results saved to ${outputPath}`);
}

async function main() {
    try {
        const args = parseArgs(process.argv);
        await fs.access(args.assetsDir);
        await generateCardColors(args);
    } catch (error) {
        console.error(error instanceof Error ? error.message : error);
        process.exit(1);
    }
}

main();


