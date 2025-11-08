// Vercel serverless function to get credit card recommendations
// This hides the OpenAI API key from the client
// Receives only the rendered cards (those with images) from the client

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, cardData } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Query is required' });
    }

    if (!cardData || !Array.isArray(cardData) || cardData.length === 0) {
      return res.status(400).json({ error: 'Card data is required' });
    }

    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    console.log(`Processing query: "${query}" for ${cardData.length} cards`);

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a helpful credit card recommendation assistant. Based on the user's query, recommend the top 3-5 most suitable credit cards from the provided list. 

For each recommended card, explain:
1. Why it matches the user's needs
2. Key benefits relevant to their query
3. Any important considerations (fees, eligibility, etc.)

Keep your response concise and helpful. Format as a numbered list.`
          },
          {
            role: 'user',
            content: `User query: "${query}"

Available credit cards:
${JSON.stringify(cardData, null, 2)}

Please recommend the best credit cards for this user.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('OpenAI API error:', error);
      
      // Return more specific error message
      let errorMessage = 'Failed to get recommendations from OpenAI';
      if (response.status === 401) {
        errorMessage = 'OpenAI API key is invalid or expired';
      } else if (response.status === 429) {
        errorMessage = 'OpenAI API rate limit exceeded or out of credits';
      } else if (error.error?.message) {
        errorMessage = `OpenAI error: ${error.error.message}`;
      }
      
      return res.status(response.status).json({ 
        error: errorMessage,
        details: error.error?.message || 'Check Vercel logs for more details'
      });
    }

    const data = await response.json();
    const recommendation = data.choices[0].message.content;

    // Extract card names from the recommendation for highlighting
    const recommendedCardNames = cardData
      .map(card => card['Card Name'])
      .filter(name => recommendation.includes(name));

    return res.status(200).json({
      recommendation,
      recommendedCardNames,
      totalCardsAnalyzed: cardData.length,
    });

  } catch (error) {
    console.error('Error in recommend API:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

