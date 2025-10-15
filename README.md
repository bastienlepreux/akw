# A kaz aw — Prototype (Vite + React)

## Démarrer en local
```bash
npm i
npm run dev
```

## Déployer sur GitHub Pages (via Actions)
1. Ouvre `vite.config.js` et remplace `base: '/<ton-repo>/'` par le **nom de ton dépôt** (ex: `/a-kaz-aw/`).  
   - Si ton dépôt s'appelle `username.github.io`, utilise `base: '/'`.
2. Commits + push sur `main`.
3. Dans *Settings → Pages*, choisis **Source: GitHub Actions**.

## Déploiement manuel (optionnel)
```bash
npm run build
# Le dossier dist/ est prêt à être servi
```
