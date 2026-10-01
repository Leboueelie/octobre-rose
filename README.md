# 🌸 Octobre Rose 2026 — Côte d'Ivoire

**Sensibiliser pour mieux prévenir.**

Site web statique de sensibilisation au cancer du sein en Côte d'Ivoire : informations générales et sourcées, signes à connaître, prévention et dépistage, idées reçues, quiz interactif, agenda des événements d'Octobre Rose 2026 et liste des sources officielles.

> ⚠️ **Avertissement médical** — Ce site est un support d'information et de sensibilisation. Il ne pose aucun diagnostic, ne propose aucun traitement et ne remplace pas une consultation auprès d'un professionnel de santé.

---

## Fonctionnalités

- **Page unique** avec navigation ancrée fluide (desktop + menu hamburger mobile)
- **Section « Comprendre »** : chiffres clés GLOBOCAN 2022 pour la Côte d'Ivoire
- **Section « Signes à connaître »** : 7 signes d'alerte + avertissement systématique
- **Section « Prévention & dépistage »** : facteurs de risque (OMS), Mammomobile, équipements remis au PNLCa
- **Idées reçues interactives** : 6 cartes retournables (mythe → réalité + source)
- **Quiz de 10 questions** : validation, explications, score, relance — 100 % côté navigateur
- **Agenda Octobre Rose 2026** : événements avec organisateur, date et source
- **FAQ en accordéon** (7 questions, ARIA)
- **Section Sources obligatoire** (Ministère de la Santé CI, PNLCa, OMS, GLOBOCAN/IARC)
- **Mode sombre** (mémorisé en `localStorage`), **bouton retour en haut**, animations d'apparition
- **Responsive mobile-first** : 320 → 360 → 390 → 430 → 768 → 1024 → 1280 px
- **Accessibilité** : HTML sémantique, skip-link, navigation clavier, `aria-*`, `prefers-reduced-motion`

## Stack technique

| Élément | Choix |
|---|---|
| HTML5 | sémantique, sans framework |
| CSS3 | 1 fichier, variables (design tokens), mobile-first |
| JavaScript | vanilla, 1 fichier, zéro dépendance |
| Backend / BDD | aucun |
| Police | `system-ui` (aucune ressource externe) |

## Arborescence

```text
.
├── index.html
├── README.md
├── robots.txt
├── sitemap.xml
├── css/
│   └── style.css
├── js/
│   └── script.js
└── assets/
    ├── images/
    │   └── hero.svg
    └── icons/
        ├── ribbon.svg · menu.svg · close.svg
        ├── moon.svg · sun.svg · arrow-up.svg · check.svg
```

## Lancer en local

Aucune installation nécessaire :

```bash
# option 1 : ouvrir le fichier directement
open index.html        # macOS
xdg-open index.html    # Linux

# option 2 : petit serveur local
python3 -m http.server 8000
# puis http://localhost:8000
```

## Déploiement (Cloudflare)

Le site est statique : aucun build n'est nécessaire.

**Déploiement actuel** : projet Cloudflare Worker avec assets statiques →
`https://octobre-rose.leboueelie.workers.dev`

### Option A — Tableau de bord (la plus simple)

1. Se connecter sur [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Upload assets** (déploiement direct)
2. Nommer le projet : `octobre-rose`
3. Déposer le **contenu de ce dossier** (pas le dossier `.git`) → **Deploy site**
4. Chaque mise à jour = re-déposer les fichiers ou **Create deployment**

### Option B — Wrangler (CLI)

```bash
# une seule fois : connexion au compte Cloudflare (ouvre le navigateur)
npx wrangler login

# déploiement depuis la racine du projet
npx wrangler pages deploy . --project-name=octobre-rose
```

### Option C — Git (déploiement continu)

1. Pousser le dépôt sur GitHub :
   ```bash
   git add .
   git commit -m "feat: site Octobre Rose 2026 — Côte d'Ivoire"
   git branch -M main
   git remote add origin https://github.com/<votre-user>/<repo>.git
   git push -u origin main
   ```
2. Cloudflare Pages → **Create** → **Pages** → **Connect to Git** → sélectionner le dépôt
3. Build command : *(vide)* · Build output directory : `/` (racine)
4. Chaque `git push` redéploie automatiquement le site

> Après le premier déploiement, mettez à jour l'URL finale dans `robots.txt` et `sitemap.xml`
> (actuellement `https://octobre-rose.leboueelie.workers.dev/`, ou votre domaine personnalisé).
> Domaine personnalisé : **Custom domains** dans les réglages du projet.

Alternatives : Netlify, Vercel, GitHub Pages (glisser-déposer ou Git).

## Confidentialité

- **Aucune donnée personnelle ni donnée de santé** n'est collectée
- Le quiz fonctionne **entièrement dans le navigateur** : aucune réponse n'est envoyée ni enregistrée
- Seul `localStorage` est utilisé, pour mémoriser le choix du thème (clair/sombre)
- Aucun cookie tiers, aucun CDN, aucune librairie externe

## Sources médicales et institutionnelles

| Organisme | Usage |
|---|---|
| Ministère de la Santé, de l'Hygiène Publique et de la Couverture Maladie Universelle (Côte d'Ivoire) | Chiffres GLOBOCAN 2022 (3 869 cas / 2 092 décès estimés), Mammomobile (18 mars 2026 — diempsante.ci), équipements PNLCa (juin 2026) |
| Programme National de Lutte contre le Cancer (PNLCa) | Dispositif national de dépistage et de diagnostic |
| Organisation mondiale de la Santé (OMS) | Fiche « Cancer du sein » du 3 juillet 2026 — signes, facteurs de risque, détection précoce |
| GLOBOCAN / IARC | Estimations 2022 d'incidence et de mortalité |
| OMS Afro | Prise en charge du cancer du sein en soins de santé primaires (2026) |

Événements de l'agenda : annonces des organisateurs (Decathlon CI & AJSCI, Yelenba – Women in Action, Lions Club Abidjan Akoben) rapportées par Abidjan.net et l'Agence Ivoirienne de Presse (AIP).

**Dernière vérification des sources : 1er octobre 2026.** Les informations de la campagne Octobre Rose 2025 (tarifs, nombre de sites de mammographie, thème) ne sont pas reprises : faute de confirmation officielle pour 2026, elles ne doivent pas être présentées comme des informations 2026.

**Note** : les chiffres GLOBOCAN sont des *estimations* et ne correspondent pas au nombre de cas enregistrés en 2026. Les dates, lieux et modalités des événements peuvent évoluer : vérifiez-les auprès de l'organisateur avant de vous déplacer.

## Auteurs

Projet Octobre Rose 2026 — Côte d'Ivoire · HTML, CSS et JavaScript vanilla, dans le cadre d'un projet pédagogique de sensibilisation.
