# Publicare și verificare live — 19 octombrie 2026

Versiunea cu toate modificările aprobate este publicată la https://adazrenov.fr/.

- Commit frontend: `93e6926`.
- Cloudflare Pages: deployment inițial `168e6de1-ffe1-4107-9f48-7dba2590732d`, ramura `main`, Production, publicat și verificat cu succes.
- Worker ADAZAI: versiunea `d470911e-9900-40ce-8cce-81a6467650c9`, cu informațiile publice actualizate.
- Build, verificările site-ului și testele Worker-ului au trecut înainte de publicare.

## Verificare independentă a domeniului public

Toate cele 7 pagini comerciale răspund cu HTTP 200. Titlurile, descrierile,
adresele canonice, instrucțiunile robots și metadatele sociale de pe live coincid
cu versiunea locală aprobată. CSP, Permissions-Policy și protecția contra încadrării
în iframe sunt active pe domeniul public.

## Meta titluri și descrieri confirmate pe live

### https://adazrenov.fr/

**Titlu:** Entreprise de rénovation en Île-de-France | ADAZ RENOV

**Descriere:** Rénovation, enduits, peinture et menuiserie en Île-de-France. Déplacements pour les grands chantiers en France, sur demande. Devis gratuit.

### https://adazrenov.fr/services

**Titlu:** Rénovation et menuiserie en Île-de-France | ADAZ RENOV

**Descriere:** Enduits, peinture, salle de bain, fenêtres, électricité et maçonnerie en Île-de-France. ADAZ RENOV accompagne particuliers et professionnels.

### https://adazrenov.fr/produits

**Titlu:** Fenêtres, portes et volets en Île-de-France | ADAZ RENOV

**Descriere:** Fenêtres, portes d’entrée et volets sur mesure en Île-de-France. Découvrez les modèles ADAZ RENOV et demandez un devis pour la fourniture et la pose.

### https://adazrenov.fr/projets

**Titlu:** Rénovation : nos réalisations en images | ADAZ RENOV

**Descriere:** Découvrez les chantiers ADAZ RENOV en photos et vidéos : appartements, salles de bain et cuisines. Contactez-nous pour vos travaux en Île-de-France.

### https://adazrenov.fr/a-propos

**Titlu:** Entreprise du bâtiment en Île-de-France | ADAZ RENOV

**Descriere:** Basée à Noiseau depuis 2021, ADAZ RENOV réalise vos travaux en Île-de-France. Déplacements possibles en France pour les chantiers d’envergure.

### https://adazrenov.fr/contact

**Titlu:** Devis rénovation en Île-de-France | ADAZ RENOV

**Descriere:** Demandez un devis gratuit pour vos travaux en Île-de-France. Pour un chantier d’envergure ailleurs en France, échangez avec l’équipe ADAZ RENOV.

### https://adazrenov.fr/ia-travaux

**Titlu:** Estimer vos travaux en Île-de-France | ADAZ RENOV

**Descriere:** Préparez vos travaux en Île-de-France avec l’assistant ADAZ RENOV : budget et durée indicatifs, à confirmer avec notre équipe par un devis.

## Favicon și fișiere publice

- `/favicon.png`: HTTP 200, PNG pătrat de 180 × 180 px, identic cu fișierul verificat local.
- `/favicon.ico`: HTTP 200, tip ICO corect, identic cu fișierul local.
- Ambele adrese sunt declarate prin `rel="icon"` pe toate paginile comerciale.
- `/sitemap.xml`: HTTP 200, identic cu cel validat local; include `/services` și celelalte 6 adrese canonice.
- `/robots.txt`: HTTP 200, permite crawl-ul și declară sitemap-ul corect.
- `/.well-known/security.txt`: HTTP 200, identic cu fișierul verificat local.
- `/security.txt`: HTTP 301 către `/.well-known/security.txt`.
- `/services.html`: HTTP 308 către `/services`.
- O adresă inexistentă răspunde cu HTTP 404.

Faviconul era deja accesibil înainte de această publicare. Iconița generică din
rezultatul Google nu însemna că fișierul lipsea. Afișarea ei și actualizarea
fragmentelor din căutare depind de recitirea și procesarea paginii de către Google;
Google nu garantează afișarea faviconului, nici un termen fix.

## Google Search Console

Sitemap-ul `https://adazrenov.fr/sitemap.xml` a fost retrimis după publicare.
API-ul Google a confirmat acceptarea la `2026-10-18T22:59:11Z`
(19 octombrie, 01:59, Europe/Chisinau). Procesarea sitemap-ului este separată de indexarea URL-urilor.

Testul Live din Search Console pentru `/services` confirmă „URL is available to
Google” și „Page can be indexed”, cu un element Breadcrumbs valid.

Solicitarea individuală de indexare pentru `/services` a fost acceptată:
„Indexing requested — URL was added to a priority crawl queue”. Prima încercare
a întâmpinat o eroare temporară de conectare la reCAPTCHA; după reîncărcarea
sesiunii și testarea live, Google a confirmat trimiterea. Aceasta este o cerere
acceptată, nu o confirmare că pagina a fost deja inclusă în index.

Solicitarea de recitire a paginii principale `https://adazrenov.fr/` a fost și ea
acceptată, cu mesajul „Indexing requested”. Această recitire permite Google să
proceseze meta titlul, descrierea și informațiile despre favicon ale versiunii noi.
Pagina principală era deja indexată; a fost solicitată actualizarea ei.

## Referințe

- [Favicon în Google Search](https://developers.google.com/search/docs/appearance/favicon-in-search)
- [Solicitarea recitirii adreselor](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
