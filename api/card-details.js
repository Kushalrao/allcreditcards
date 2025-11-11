import { promises as fs } from 'fs';
import path from 'path';

const CACHE_FILENAME = 'cardDetailsCache.json';
const CACHE_PATH = path.join(process.cwd(), CACHE_FILENAME);

async function loadCache() {
  try {
    const raw = await fs.readFile(CACHE_PATH, 'utf-8');
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }
    console.error('[card-details] Failed to read cache:', error);
    return {};
  }
}

async function writeCache(cache) {
  try {
    await fs.writeFile(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (error) {
    console.error('[card-details] Failed to write cache:', error);
  }
}

function getCardKey(card) {
  if (!card) return null;
  const key = card['Card Name'] || card.card_name || card.name || '';
  return key ? key.trim() : null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { card } = req.body || {};

    if (!card || typeof card !== 'object') {
      return res.status(400).json({ error: 'Card payload is required' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const cardKey = getCardKey(card);
    const cache = await loadCache();

    if (cardKey && cache[cardKey]?.payload) {
      console.log(`[card-details] Cache hit for "${cardKey}"`);
      return res.status(200).json(cache[cardKey].payload);
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
        model: 'gpt-4.1',
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
      console.error('OpenAI card-details error:', error);
      let message = 'Failed to fetch card details from OpenAI';
      if (response.status === 401) {
        message = 'OpenAI API key is invalid or expired';
      } else if (response.status === 429) {
        message = 'OpenAI API rate limit exceeded or out of credits';
      } else if (error.error?.message) {
        message = error.error.message;
      }
      return res.status(response.status).json({ error: message });
    }

    const data = await response.json();
    let content = data?.choices?.[0]?.message?.content || '';
    content = content.trim();

    if (content.startsWith('```')) {
      content = content.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    }

    try {
      const parsed = JSON.parse(content);

      console.log(
        '[card-details] OpenAI response',
        JSON.stringify({
          cardName: parsed.card_name || card?.['Card Name'] || card?.name || 'Unknown card',
          payload: parsed
        })
      );

      if (cardKey) {
        cache[cardKey] = {
          payload: parsed,
          cachedAt: new Date().toISOString()
        };
        await writeCache(cache);
      }

      return res.status(200).json(parsed);
    } catch (parseError) {
      console.error('Failed to parse OpenAI JSON:', content);
      return res.status(502).json({ error: 'Invalid JSON returned from OpenAI' });
    }
  } catch (error) {
    console.error('Error in card-details API:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}


