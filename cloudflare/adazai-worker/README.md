# ADAZAI Cloudflare Worker

Backend gratuit pentru chatul ADAZAI:

- cheia OpenAI este stocata ca Cloudflare Worker Secret;
- conversatiile sunt pastrate in D1;
- OpenAI Responses API foloseste `store: false`;
- browserul nu primeste niciodata cheia.

## Configurare

```bash
npm install
npx wrangler login
npm run db:create
```

Copiaza `database_id` returnat in `wrangler.jsonc`, apoi:

```bash
npm run db:migrate:remote
npx wrangler secret put OPENAI_API_KEY
npm run deploy
```

Comanda pentru secret cere valoarea direct in terminal. Foloseste o cheie OpenAI
noua, nu cheia publicata intr-un screenshot sau mesaj.

Dupa deploy, copiaza URL-ul Worker in `ai-config.js`:

```js
window.AI_AISSTEN_CHAT_CONFIG = {
  apiUrl: "https://adazai-api.<cont>.workers.dev/chat",
};
```

Pentru test local:

```bash
cp .dev.vars.example .dev.vars
npm run db:migrate:local
npm run dev
```
