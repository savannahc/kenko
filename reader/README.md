# Reader

A newsletter reader PWA that pulls articles from Gmail via the Gmail API.

## Setup

### Prerequisites

- Node.js 18+
- A Google Cloud project with OAuth 2.0 credentials
- Vercel CLI (`npm i -g vercel`) for local development

### Google Cloud OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the **Gmail API** under APIs & Services > Library
4. Go to APIs & Services > Credentials
5. Create an **OAuth 2.0 Client ID** (Web application type)
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback` (local dev)
   - `https://your-domain.vercel.app/api/auth/callback` (production)
7. Copy the Client ID and Client Secret

### Gmail Label Setup

1. In Gmail, create a label called `to read` (or your preferred name)
2. Apply this label to newsletters you want to appear in Reader
3. The app reads messages with this label and removes it when you archive

### Environment Variables

Create a `.env` file (or set in Vercel dashboard):

```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
APP_URL=http://localhost:3000
GMAIL_LABEL=to read
```

### Local Development

```bash
npm install
vercel dev
```

This starts both the Vite dev server and the API serverless functions.

### Build & Preview

```bash
npm run build
npm run preview
```

### Running Tests

```bash
npx vitest run
```
