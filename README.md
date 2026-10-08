# ADAZ RENOV

Site de présentation d’ADAZ RENOV : services, produits, réalisations, équipe,
contact et assistant ADAZAI. HTML, CSS et JavaScript, avec un build statique
pour Cloudflare Pages.

## Développement

Utiliser Node.js 22 ou une version LTS plus récente.

```bash
npm ci
npm run build
npm run preview
```

Ouvrir `http://127.0.0.1:8765`. Après une modification des sources, relancer
`npm run build` et actualiser la page. Le port peut être changé avec la variable
`ADAZ_PREVIEW_PORT`.

## Organisation

- Les fichiers HTML à la racine contiennent les pages du site.
- `styles.css` et `script.js` contiennent les styles et les comportements.
- `assets/` contient les médias utilisés, leurs originaux nécessaires à
  l’optimisation, les icônes et le font Manrope avec leurs licences.
- `scripts/` contient le build, la prévisualisation et l’optimisation des médias.
- `cloudflare/adazai-worker/` contient le backend du chat ADAZAI.
- `firebase/` et `FIREBASE_SETUP.md` conservent les intégrations backend
  optionnelles de réservation, de catalogue et de contact.
- `dist/` est généré automatiquement et exclu de Git.

Les médias sans référence, les anciennes copies optimisées, les journaux et les
caches locaux ne sont pas nécessaires au dépôt. Ne pas supprimer un original
référencé dans `scripts/media-manifest.json` : il sert à régénérer ses copies
optimisées avec `npm run media:optimize`.

## Publication GitHub et Cloudflare Pages

Repository : [hitoori/adazrenov](https://github.com/hitoori/adazrenov).

Créer un projet Cloudflare **Pages** connecté à ce repository :

| Paramètre | Valeur |
| --- | --- |
| Branche de production | `main` |
| Framework | None |
| Commande de build | `npm run build` |
| Répertoire de sortie | `dist` |
| Répertoire racine | racine du repository |
| Version de Node.js | `22` |

Cloudflare génère `dist/` à partir des sources. Les mises à jour de la branche
de production déclenchent ensuite un nouveau déploiement. Voir
[CLOUDFLARE_DEPLOY.md](CLOUDFLARE_DEPLOY.md) pour les domaines, le DNS et le SEO.

Le Worker ADAZAI se déploie séparément. L’origine du domaine `pages.dev` doit
être ajoutée à `ALLOWED_ORIGINS` pour autoriser le chat sur l’aperçu Cloudflare.
Les fonctions Firebase ne sont pas déployées par le build Pages.

## Configuration privée

`ai-config.js` est une configuration publique envoyée au navigateur. Ne jamais
y placer une clé OpenAI, un mot de passe SMTP ou une clé privée. Les secrets du
Worker se configurent avec Cloudflare Worker Secrets. Les fichiers `.env`,
`.dev.vars`, les dépendances installées et les caches sont exclus de Git.
Seuls les fichiers d’exemple avec des valeurs fictives sont versionnés.
