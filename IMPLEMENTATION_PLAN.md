# Credit Card Recommendation System - Implementation Plan

## Current State
- **500 credit cards** in data.txt (~110KB, ~20,000 tokens)
- Each card has: Name, Bank, Type, Annual Fee, Network, Key Benefits
- Search bar already exists in the UI

## Problem Statement
We need to recommend credit cards based on user queries without sending all 500 cards with every API request (expensive & slow).

---

## Cost Analysis

### Option A: Send All Cards Every Time (Naive Approach)
- **Tokens per request**: ~20,000 (card data) + ~100 (query + instructions) = 20,100 tokens
- **Cost per request**:
  - GPT-4o: $0.05 per request
  - GPT-3.5 Turbo: $0.01 per request
- **Issues**: Expensive, slow, hits rate limits quickly
- **Monthly cost (1000 users, 3 queries each)**: $150-300

---

## ✅ RECOMMENDED: Option B - Embeddings + Semantic Search

### How It Works
1. **One-time setup**: Convert all 500 cards into vector embeddings
2. **Per query**: 
   - Convert user query to embedding
   - Find top 5-10 most relevant cards using cosine similarity
   - Send ONLY those cards to GPT for final recommendation
3. **Result**: Smart recommendations with 95% cost reduction

### Cost Breakdown
- **One-time embedding**: 20K tokens × $0.00002 = **$0.0004** (negligible)
- **Per query**: 
  - Embed query: ~50 tokens × $0.00002 = **$0.000001**
  - GPT on 10 cards: ~1,000 tokens × $0.0005 = **$0.0005**
  - **Total: ~$0.0005 per query** (GPT-3.5 Turbo)
- **Monthly cost (1000 users, 3 queries each)**: **$1.50** 💰

### Technical Stack
- **Embedding Model**: `text-embedding-3-small` (cheapest, 1536 dimensions)
- **Storage**: Browser localStorage (no database needed for 500 cards)
- **Similarity Search**: Pure JavaScript (no external dependencies)
- **LLM**: GPT-3.5 Turbo (fast, cheap, good enough for recommendations)

### Architecture
```
User Query → Embed Query → Find Top 10 Similar Cards → GPT-3.5 Turbo → Display Results
              ↓                    ↑
         OpenAI API          Pre-computed embeddings
                            (stored in localStorage)
```

### Implementation Steps
1. **Backend/Build-time** (one-time):
   - Create Node.js script to generate embeddings for all 500 cards
   - Save embeddings to `embeddings.json`
   
2. **Frontend** (per query):
   - Load embeddings.json on page load (cache in localStorage)
   - When user searches:
     - Call OpenAI API to embed user query
     - Calculate cosine similarity with all card embeddings (fast in JS)
     - Get top 10 matches
     - Send those 10 cards + query to GPT-3.5 Turbo
     - Display recommendations

3. **Optimizations**:
   - Cache query embeddings (same query = no re-embedding)
   - Cache final recommendations for 1 hour
   - Show instant results from local keyword search while API loads

---

## Alternative Options (Not Recommended)

### Option C: Prompt Caching (OpenAI's "Memory")
**What it is**: OpenAI's prompt caching gives 50% discount on repeated input tokens (prompts >1024 tokens)

**For our use case:**
- **How it works**: Send all 500 cards + user query every time, but cached cards get 50% off
- **Cost per request**: 
  - First request: 20,000 tokens × $0.0005 = $0.01
  - Cached requests: 20,000 tokens × $0.00025 = $0.005 (50% off)
- **Issues**:
  - ❌ Still expensive ($0.005 vs $0.0005 for embeddings = 10x more)
  - ❌ Cache expires after 5-10 minutes
  - ❌ Each user has separate cache (not shared)
  - ❌ Still sending 20K tokens = slower responses
- **Monthly cost (3,000 queries)**: **$15** (assuming 80% cache hit rate)
- **Verdict**: Better than naive but still 10x more expensive than embeddings

### Option D: Third-Party Memory Solutions (Mem0, Memobase)
- **What it is**: External services that add persistent memory to OpenAI API
- **Issues**: Adds another service dependency, subscription costs, privacy concerns
- **Verdict**: Unnecessary complexity for static card data

### Option E: Client-side Keyword Matching Only
- **Cost**: $0 (no API calls)
- **Quality**: Poor - can't understand intent ("rewards for travel" won't match "miles")
- **Verdict**: Too basic for good UX

### Option F: OpenAI Assistants API with File Search
- **Cost**: $0.10/GB/day storage + $0.20/GB retrieval
- **Issues**: More expensive for small datasets, requires backend
- **Verdict**: Overkill for 500 cards

### Option G: Fine-tuned Model
- **Cost**: $3+ for training, then $0.012 per 1K tokens
- **Issues**: Expensive upfront, doesn't improve recommendations much
- **Verdict**: Not worth it

---

## Final Recommendation

**Go with Option B (Embeddings + Semantic Search)**

### Why?
✅ **95% cost reduction** vs naive approach  
✅ **Fast responses** (only 10 cards sent to GPT)  
✅ **No backend needed** (embeddings stored client-side)  
✅ **Smart matching** (understands "travel rewards" = "miles" = "frequent flyer")  
✅ **Scalable** to 1000s of users  
✅ **Simple implementation** (~200 lines of code)  

### Estimated Costs
- Development: 2-3 hours
- Monthly API costs: **$1.50** for 3,000 queries
- Per-query latency: ~2-3 seconds

---

## Security & Best Practices

1. **API Key**: Store in environment variable, use serverless function (Vercel) to hide from client
2. **Rate Limiting**: Implement client-side debouncing (500ms) + server-side limits
3. **Caching**: 
   - Cache embeddings in localStorage (they never change)
   - Cache recommendations for 1 hour
4. **Fallback**: If API fails, show keyword-based results
5. **User Experience**: Show loading state, allow canceling slow queries

---

## Next Steps

1. ✅ Review this plan
2. Create embedding generation script (Node.js)
3. Generate embeddings.json file
4. Update search bar to call OpenAI API
5. Implement similarity search in JavaScript
6. Add result display UI
7. Test with various queries
8. Deploy to Vercel with environment variables

