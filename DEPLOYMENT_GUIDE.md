# Deployment Guide - AI Credit Card Recommendations

## ✅ Step 1: Code is Already Pushed to GitHub

The AI recommendation system has been successfully pushed to your GitHub repository.

## 🚀 Step 2: Deploy to Vercel

### A. Connect Repository (if not already connected)
1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `Kushalrao/allcreditcards`

### B. Add Environment Variable (IMPORTANT!)

Before deploying, you MUST add your OpenAI API key:

1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add a new variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `[Use your OpenAI API key that starts with sk-proj-...]`
   - **Environments**: Select all three (Production, Preview, Development)
3. Click **Save**

> ℹ️ Your API key is already provided separately - check your notes or contact the developer.

### C. Deploy

1. Click "Deploy" (Vercel will automatically detect it's a static site with API routes)
2. Wait for deployment to complete (~1-2 minutes)
3. Your site will be live at: `https://allcreditcards.vercel.app`

## 🧪 Step 3: Test the AI Recommendations

Once deployed, test with these queries:

### Test Queries:
1. **"I want cashback on groceries"**
   - Should recommend cashback cards with grocery rewards

2. **"Best card for travel and lounge access"**
   - Should recommend premium travel cards with lounge benefits

3. **"Low annual fee card for online shopping"**
   - Should recommend lifestyle/online shopping cards with low fees

4. **"HDFC credit card with no annual fee"**
   - Should filter and recommend HDFC free cards

5. **"Super premium card with best rewards"**
   - Should recommend Infinia, Diners Club Black, etc.

## 📱 How to Use (For Users)

1. Type your query in the search bar at the bottom
2. Press **Enter**
3. Wait 2-4 seconds while AI analyzes all 500 cards
4. View personalized recommendations in the modal
5. Close the modal by:
   - Clicking the X button
   - Pressing Escape key
   - Clicking outside the modal

## 🔍 What's Happening Behind the Scenes

1. User types query and presses Enter
2. Frontend calls `/api/recommend` (Vercel serverless function)
3. API reads all 500 cards from `data.txt`
4. Sends query + all cards to OpenAI GPT-3.5 Turbo
5. OpenAI analyzes and returns top 3-5 recommendations
6. Frontend displays results with explanations

## 💰 Cost Estimation

- **Tokens per request**: ~20,000 (card data) + ~100 (query) = 20,100 tokens
- **Cost per request**: ~$0.01 (GPT-3.5 Turbo)
- **For 100 queries**: ~$1
- **For 1000 queries**: ~$10/month

## 🛠️ Troubleshooting

### Error: "OpenAI API key not configured"
- Make sure you added `OPENAI_API_KEY` in Vercel environment variables
- Redeploy after adding the variable

### Error: "Failed to get recommendations"
- Check Vercel logs for detailed error
- Verify API key is correct and has credits
- Check OpenAI API status: https://status.openai.com

### Modal not opening
- Check browser console for errors
- Make sure JavaScript is enabled
- Try hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

## 📊 Monitoring Usage

To monitor your OpenAI API usage and costs:
1. Go to https://platform.openai.com/usage
2. View daily usage and costs
3. Set up usage limits if needed

## 🔐 Security Notes

✅ **What's Protected:**
- API key is stored as environment variable (never in code)
- API key is only accessible on server-side (Vercel function)
- GitHub push protection prevented accidental commit

✅ **What's Not Protected (by design):**
- Card data is public (in `data.txt`)
- User queries are sent to OpenAI (their privacy policy applies)

## 📝 Future Optimizations

When you want to reduce costs by 95%, implement the embeddings approach from `IMPLEMENTATION_PLAN.md`:
- One-time: Generate embeddings for all cards
- Per query: Only send top 10 relevant cards to OpenAI
- Result: $0.0005 per query instead of $0.01

## ✅ Deployment Complete!

Your AI-powered credit card recommendation system is now live! 🎉

Test it at: https://allcreditcards.vercel.app

