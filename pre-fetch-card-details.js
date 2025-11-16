import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Note: Environment variables should be set before running this script
// For example: OPENAI_API_KEY=your_key KV_REST_API_URL=... KV_REST_API_TOKEN=... node pre-fetch-card-details.js

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getCardKey(card) {
  if (!card) return null;
  const key = card['Card Name'] || card.card_name || card.name || '';
  return key ? key.trim() : null;
}

async function fetchCardDetailsFromOpenAI(card) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured in environment variables');
  }

  const trimmedCard = JSON.stringify(card, null, 2);

  const detailPrompt = `You are a meticulous Indian credit card domain expert. Using the card information provided, output ONLY a strictly valid JSON object that matches the structure below. Populate every field with accurate, card-specific details. If the information is unavailable, use null for singular values or [] for arrays. Never invent generic text.

Required JSON structure (example placeholders shown):
{
  "card_name": "...",
  "issuer": "...",
  "network": "...",
  "variant": "...",
  "summary": {
    "positioning": "...",
    "ideal_user_profiles": ["...", "..."]
  },
  "fees_charges": {
    "joining_fee": "...",
    "annual_fee": "...",
    "renewal_waiver_condition": "...",
    "add_on_card_fee": "...",
    "finance_charges_apr": "...",
    "cash_advance_fee": "...",
    "forex_markup_fee": "...",
    "late_payment_fee": [
      { "slab": "...", "fee": "..." }
    ],
    "overlimit_fee": "...",
    "emi_processing_fee": "...",
    "fuel_surcharge": "...",
    "other_charges": ["...", "..."]
  },
  "reward_structure": {
    "reward_currency": "...",
    "base_earn_rate": "...",
    "category_multipliers": [
      {
        "category": "...",
        "earn_rate": "...",
        "monthly_cap": "...",
        "exclusions": "..."
      }
    ],
    "reward_redemption": {
      "catalog_value": "...",
      "air_miles_transfer": "...",
      "statement_credit": "...",
      "expiry_policy": "..."
    }
  },
  "welcome_and_milestone_benefits": {
    "welcome_benefit": {
      "description": "...",
      "fulfilment_timeline": "...",
      "eligibility_condition": "..."
    },
    "renewal_benefit": "...",
    "milestone_benefits": [
      {
        "spend_threshold": "...",
        "reward": "...",
        "notes": "..."
      }
    ],
    "spend_based_fee_waiver": "..."
  },
  "travel_and_lounge": {
    "domestic_lounge_access": {
      "visits_per_year": "...",
      "program": "...",
      "guest_policy": "..."
    },
    "international_lounge_access": {
      "program": "...",
      "free_visits": "...",
      "guest_policy": "..."
    },
    "additional_travel_benefits": ["...", "..."]
  },
  "insurance_and_protection": {
    "travel_insurance": [
      {
        "cover_type": "...",
        "coverage_amount": "...",
        "conditions": "..."
      }
    ],
    "purchase_protection": "...",
    "lost_card_liability": "...",
    "fuel_surcharge_waiver": "..."
  },
  "lifestyle_and_partner_offers": {
    "dining_programs": ["...", "..."],
    "entertainment": ["...", "..."],
    "shopping_partners": ["...", "..."],
    "fuel_partnerships": ["...", "..."],
    "other_weekly_monthly_offers": ["...", "..."]
  },
  "add_on_features": {
    "contactless": "...",
    "add_on_cards": "...",
    "mobile_app_features": ["...", "..."],
    "forex_markets": ["...", "..."]
  },
  "promotions_and_limited_offers": [
    {
      "offer_name": "...",
      "valid_till": "...",
      "offer_details": "..."
    }
  ]
}

Card data:
${trimmedCard}

Respond with JSON only. Do not wrap in markdown, explanations, or additional text.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      temperature: 0.2,
      max_tokens: 1600,
      messages: [
        {
          role: 'system',
          content: 'You are a strict JSON generator. Output must be valid JSON with no extra commentary.',
        },
        {
          role: 'user',
          content: detailPrompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    let message = 'Failed to fetch card details from OpenAI';
    if (response.status === 401) {
      message = 'OpenAI API key is invalid or expired';
    } else if (response.status === 429) {
      message = 'OpenAI API rate limit exceeded or out of credits';
    } else if (error.error?.message) {
      message = error.error.message;
    }
    throw new Error(message);
  }

  const data = await response.json();
  let content = data?.choices?.[0]?.message?.content || '';
  content = content.trim();

  if (content.startsWith('```')) {
    content = content.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  }

  try {
    return JSON.parse(content);
  } catch (parseError) {
    console.error('Failed to parse OpenAI JSON:', content);
    throw new Error('Invalid JSON returned from OpenAI');
  }
}

async function checkVercelStorage(cardKey) {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return null;
  }

  try {
    const cacheResponse = await fetch(`${process.env.KV_REST_API_URL}/get/${encodeURIComponent(cardKey)}`, {
      headers: {
        'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`
      }
    });

    if (cacheResponse.ok) {
      const cached = await cacheResponse.json();
      if (cached?.result?.payload) {
        return cached.result.payload;
      }
    }
  } catch (error) {
    console.warn(`[pre-fetch] Failed to check Vercel storage for "${cardKey}":`, error.message);
  }

  return null;
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function preFetchAllCardDetails() {
  const dataPath = path.join(__dirname, 'data.txt');
  const cardData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  const outputPath = path.join(__dirname, 'cardDetailsFull.json');
  let existingData = {};
  
  // Load existing data if file exists
  if (fs.existsSync(outputPath)) {
    try {
      existingData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      console.log(`Loaded ${Object.keys(existingData).length} existing card details`);
    } catch (error) {
      console.warn('Could not load existing cardDetailsFull.json, starting fresh');
    }
  }

  const totalCards = cardData.length;
  let processed = 0;
  let fetched = 0;
  let cached = 0;
  let errors = 0;

  console.log(`\nStarting to pre-fetch details for ${totalCards} cards...\n`);

  for (const card of cardData) {
    const cardName = card['Card Name'];
    if (!cardName) {
      processed++;
      continue;
    }

    const cardKey = getCardKey(card);
    
    // Skip if we already have this card's details
    if (existingData[cardKey]) {
      processed++;
      cached++;
      if (processed % 50 === 0) {
        console.log(`Progress: ${processed}/${totalCards} (${cached} cached, ${fetched} fetched, ${errors} errors)`);
      }
      continue;
    }

    try {
      // First check Vercel storage
      let cardDetails = await checkVercelStorage(cardKey);
      
      if (!cardDetails) {
        // Fetch from OpenAI
        console.log(`Fetching details for: ${cardName}`);
        cardDetails = await fetchCardDetailsFromOpenAI(card);
        fetched++;
        
        // Add delay to avoid rate limiting (2 seconds between requests)
        await delay(2000);
      } else {
        console.log(`Found in Vercel storage: ${cardName}`);
        cached++;
      }

      // Store in our local data structure
      existingData[cardKey] = cardDetails;
      
      // Save progress periodically (every 10 cards)
      if ((processed + 1) % 10 === 0) {
        fs.writeFileSync(outputPath, JSON.stringify(existingData, null, 2), 'utf8');
        console.log(`Saved progress: ${processed + 1}/${totalCards} cards processed`);
      }

    } catch (error) {
      console.error(`Error fetching details for "${cardName}":`, error.message);
      errors++;
      
      // Continue with next card even if this one fails
    }

    processed++;
    
    if (processed % 50 === 0) {
      console.log(`Progress: ${processed}/${totalCards} (${cached} cached, ${fetched} fetched, ${errors} errors)`);
    }
  }

  // Final save
  fs.writeFileSync(outputPath, JSON.stringify(existingData, null, 2), 'utf8');

  console.log(`\n✅ Pre-fetch complete!`);
  console.log(`   Total cards: ${totalCards}`);
  console.log(`   Processed: ${processed}`);
  console.log(`   From cache: ${cached}`);
  console.log(`   Fetched from OpenAI: ${fetched}`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Data saved to: ${outputPath}`);
}

// Run the pre-fetch
try {
  preFetchAllCardDetails();
} catch (error) {
  console.error('Fatal error in pre-fetch script:', error);
  process.exit(1);
}

