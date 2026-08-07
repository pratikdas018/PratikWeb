# Pratik Chandra Das Portfolio

Modern React portfolio for Pratik Chandra Das, integrated with a lazy-loaded AI Portfolio Assistant. The assistant UI calls a separate Express RAG backend and never communicates directly with OpenAI.

## Frontend Stack

- React 19
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- EmailJS
- React Markdown

## AI Assistant

The chatbot is mounted in `src/components/PortfolioAssistant.jsx` and uses `src/services/portfolioAssistantApi.js` for streamed API calls.

Frontend responsibilities:

- Floating chatbot button
- Responsive chat panel
- Suggested questions
- Streaming response rendering
- Markdown rendering
- Copy button
- Clear chat
- Conversation history in local storage
- Source references
- Project cards
- Dark and light mode styling aligned with the existing portfolio

Backend responsibilities live in the separate sibling project:

```text
../portfolio-assistant-backend
```

## Local Setup

Frontend:

```bash
npm install
cp .env.example .env
npm run dev
```

Backend:

```bash
cd ../portfolio-assistant-backend
npm install
cp .env.example .env
docker compose up -d
npm run ingest
npm run dev
```

Open `http://localhost:5173`.

## Environment Variables

Frontend:

```text
VITE_CHAT_API_URL=http://localhost:8080/api
```

Backend variables are documented in `../portfolio-assistant-backend/README.md`.

## Deployment

Vercel frontend:

1. Deploy this React project to Vercel.
2. Set `VITE_CHAT_API_URL` to the Railway backend API URL.

Railway backend:

1. Deploy `../portfolio-assistant-backend`.
2. Configure OpenAI and Qdrant environment variables.
3. Run ingestion whenever the markdown knowledge base changes.

## Contact

- Email: developedwithpratik@gmail.com
- LinkedIn: https://www.linkedin.com/in/pratik018
- GitHub: https://github.com/pratikdas018
