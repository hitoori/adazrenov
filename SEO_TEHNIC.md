# Verificare SEO tehnic și pregătire pentru publicare

Data verificării: 19 octombrie 2026. Domeniu: https://adazrenov.fr/.
Modificările descrise mai jos sunt pregătite în proiectul local și în `dist`.
Nu au fost publicate pe domeniul live în această etapă.

## Ce am verificat și ajustat

| Element | Rezultat |
| --- | --- |
| Sitemap | 7 pagini comerciale, numai URL-uri HTTPS canonice fără `.html`. Fișierul sursă vechi a fost corectat. Build-ul generează sitemap-ul și verifică concordanța cu sursa. |
| robots.txt | Corect: permite accesul crawlerelor și declară sitemap-ul public. Nu blochează CSS, JavaScript sau imaginile. |
| Indexare | Paginile comerciale permit indexarea; paginile juridice, pagina 404 și domeniile temporare Pages păstrează instrucțiunile `noindex` intenționate. |
| Titluri și descrieri | Prezente și distincte pe toate cele 9 pagini. Paginile comerciale păstrează formulările despre Île-de-France deja aprobate. |
| Adrese canonice | Coerente cu sitemap-ul și cu URL-urile Open Graph. |
| Distribuire socială | Completate Twitter Cards și dimensiunile imaginii Open Graph, folosind logo-ul existent. |
| Previzualizări în căutare | Paginile comerciale permit `max-image-preview:large`. Google decide efectiv ce afișează. |
| Titluri HTML | Un singur H1 pe fiecare pagină verificată. |
| Imagini | 185 de elemente verificate: atribut `alt` prezent și dimensiuni intrinseci pentru limitarea deplasărilor de conținut. |
| Linkuri | 415 apariții de linkuri interne verificate, inclusiv ancore. Ancora `#outil-projet` există acum și în HTML-ul inițial, înainte de inițializarea JavaScript. |
| Date structurate | JSON-LD valid sintactic pentru firmă, site, pagini, navigare și catalog. Nu sunt adăugate recenzii, prețuri sau certificări inventate. |
| Favicon | Păstrate adresele stabile `/favicon.png` și `/favicon.ico`, cu dimensiunile reale declarate. |
| Pagina 404 | Răspunde cu HTTP 404 pentru o adresă inexistentă și conține `noindex`. |
| Publicare | `dist` nu include sursele backend, `.env`, `.git`, `node_modules` sau documentația proiectului. |

## security.txt și protecția browserului

Fișierul `/.well-known/security.txt` exista deja și era valid pe site-ul public.
Am reverificat contactul `adazrenov@gmail.com`, adresa canonică și expirarea la
`2027-10-13T23:59:59Z`. Am adăugat data verificării și redirecționarea permanentă
`/security.txt` către locația standard. Verificarea automată blochează publicarea
unui fișier expirat și avertizează cu 30 de zile înainte.

Noile antete pregătite pentru Pages sunt:

- `Content-Security-Policy`: limitează sursele resurselor, scripturile și iframe-urile;
- `X-Frame-Options: DENY` și `frame-ancestors 'none'`: împiedică încadrarea site-ului în alte pagini;
- `X-Content-Type-Options: nosniff`: împiedică interpretarea unui fișier ca alt tip de conținut;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `Permissions-Policy`: limitează camera, microfonul, geolocalizarea, plățile și USB.

Politica păstrează stilurile inline necesare interfeței. Scripturile inline
executabile și `eval` sunt blocate. Sunt autorizate sursele folosite pentru
Turnstile, ADAZAI, Maps, Analytics fără funcții publicitare și beacon-ul Cloudflare.
Antetele sunt comune build-ului și serverului de previzualizare, pentru testarea
compatibilității înainte de publicare. HTTPS, redirectarea `www` și HSTS sunt deja
active pe domeniul public și nu au fost modificate.

`security.txt` este un canal de contact pentru raportarea vulnerabilităților;
nu este o măsură de blocare a atacurilor și nu este un factor SEO.
Aceste verificări nu reprezintă un audit complet de securitate al Worker-ului,
al infrastructurii Cloudflare sau al conturilor externe.

## Date reale din Google Search Console

În ultimele 28 de zile complete, până la 16 octombrie 2026:

- 12 clicuri și 56 de afișări;
- aproape toate afișările paginilor sunt pentru Acasă: 55; Produse are 1;
- interogările vizibile includ în principal numele firmei. Google anonimizează
  o parte dintre interogări; eșantionul nu este suficient pentru concluzii ferme
  despre poziționarea serviciilor.

Inspecția individuală a adreselor a confirmat:

| Pagină | Stare raportată de Google |
| --- | --- |
| `/` | Indexată; adresa canonică Google coincide cu cea declarată. |
| `/produits` | Indexată; canonical corect. |
| `/projets` | Indexată; canonical corect. |
| `/a-propos` | Indexată; canonical corect. |
| `/contact` | Indexată; canonical corect. |
| `/ia-travaux` | Indexată; canonical corect. |
| `/services` | URL încă necunoscut pentru Google. |

Sitemap-ul public este deja trimis în GSC. Ultima citire raportată este din
16 octombrie 2026, cu 7 adrese și fără erori sau avertismente. Câmpul vechi
„indexed” din raportul sitemap nu a fost folosit pentru a deduce indexarea;
stările de mai sus provin din URL Inspection.

## Validare efectuată

- `npm run build`: generează site-ul și execută verificările automat;
- `npm run check`: repetă verificarea fișierelor deja generate;
- verificări negative: un H1 lipsă, un security.txt expirat și o ancoră invalidă
  sunt detectate și produc eșecul verificării; fișierele de test au fost restaurate;
- verificări HTTP locale pentru pagini, sitemap, robots, security.txt,
  redirecționare și răspunsul 404;
- verificări în browser cu CSP activ: redare video locală, filtru de catalog,
  deschiderea asistentului, accesul la estimator și încărcarea hărții;
- verificare de afișare la 1280 px și 390 px, fără depășire orizontală pe pagina
  verificată pe mobil;
- nicio blocare CSP observată în aceste fluxuri.

Turnstile raportează în continuare `110200` pe localhost, deoarece cheia de
producție autorizează numai domeniul public. Această configurație a fost păstrată.
Nu au fost trimise cereri de contact, emailuri sau mesaje de chat pentru testare.
Google Analytics rămâne dezactivat pe localhost, conform configurației existente.

Optimizările existente sunt păstrate: imagini WebP responsive, dimensiuni în HTML,
fonturi locale, resurse cu hash și cache, JavaScript separat pe pagini și asistent
încărcat la interacțiune. Nu declar un scor Lighthouse sau un rezultat Core Web
Vitals: conectarea CrUX din GSC Wizard nu are cheia API configurată.

## Pași după publicare și priorități de conținut

1. Publicarea versiunii pregătite din `dist`, apoi verificarea antetelor pe domeniul
   public, a formularului cu Turnstile și a livrării unei cereri controlate.
2. În GSC, inspectarea `https://adazrenov.fr/services` și solicitarea manuală a
   indexării. Nu există o garanție sau un termen fix de indexare.
3. Verificarea rezultatului real cu PageSpeed Insights pe mobil, pe versiunea
   publicată. Rezultatele locale și scorurile de laborator nu înlocuiesc datele
   utilizatorilor reali.
4. Pentru următoarea etapă SEO: pagini dedicate serviciilor principale, cu lucrări
   și fotografii proprii, prestații precise și întrebări specifice. Evitarea
   paginilor aproape identice pentru zeci de orașe.
5. Completarea proiectelor cu informații reale confirmate: localitate, an,
   intervenții efectuate și fotografii înainte/după. Nu se completează localități
   sau rezultate comerciale prin presupunere.

## Referințe tehnice

- [Google: sitemap și adrese canonice](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: consolidarea adreselor duplicate](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [RFC 9116: security.txt](https://www.rfc-editor.org/rfc/rfc9116.html)
- [Cloudflare Pages: antete HTTP](https://developers.cloudflare.com/pages/configuration/headers/)
- [Cloudflare Turnstile: CSP](https://developers.cloudflare.com/turnstile/reference/content-security-policy/)
- [Google Analytics: CSP](https://developers.google.com/tag-platform/security/guides/csp)
- [Cloudflare Web Analytics: CSP](https://developers.cloudflare.com/web-analytics/faq/)
