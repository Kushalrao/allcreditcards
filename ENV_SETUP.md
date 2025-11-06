# Environment Variables Setup

## For Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add the following variable:

```
Name: OPENAI_API_KEY
Value: [Your OpenAI API key - provided separately]
Environments: Production, Preview, Development
```

4. Click **Save**

## For Local Development

Create a `.env.local` file in the project root (this file is gitignored):

```
OPENAI_API_KEY=your_openai_api_key_here
```

## Getting Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and use it in the steps above

## Security Note

⚠️ **NEVER commit API keys to git**. The `.env.local` file is automatically ignored by git.

