# Monrovia Organized Baseball & Softball (demo)

Sales demo redesign for [monroviaball.com](https://www.monroviaball.com/), built from the Sluggers Ohio codebase patterns **without** modifying the Sluggers repo.

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Register and Login redirect to the live Stack Sports URLs on monroviaball.com.

## Content source

Scraped inventory: `migration/reports/CONTENT-INVENTORY.md`  
Raw HTML: `migration/scrape/`

## Deploy

Set `NEXT_PUBLIC_SITE_URL` and keep `NEXT_PUBLIC_ALLOW_INDEXING=false` until the client approves indexing (workspace default).
