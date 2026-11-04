# Sunny Raj Portfolio

A full-stack portfolio built with Next.js, TypeScript, and SQLite.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The first successful contact form submission creates `data/portfolio.db` and saves the message in its `contact_messages` table.

To store the database elsewhere, set `PORTFOLIO_DB_PATH` to an absolute file path. `.env.example` documents the optional setting.

## Production

```bash
npm run build
npm start
```

The contact API requires a Node.js runtime and a writable, persistent disk for the SQLite database. For serverless hosting, replace the local SQLite store with a managed database before deployment, since serverless filesystems are generally ephemeral.
