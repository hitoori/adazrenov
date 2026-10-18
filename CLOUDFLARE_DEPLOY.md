# Publicarea ADAZ RENOV pe Cloudflare Pages

Site-ul se publică din directorul **`dist`**, generat prin comanda de build.
Directorul proiectului conține și originale media, cod backend și configurații
locale; acesta nu trebuie folosit ca director de publicare.

## Build și verificare locală

```bash
npm ci
npm run build
npm run preview
```

Previzualizarea se deschide la `http://127.0.0.1:8765`.
Serverul local folosește Node.js, servește și rutele fără extensie (de exemplu
`/produits`) și permite încărcarea parțială a videoclipurilor pentru redare și
derulare. Comprimă HTML, CSS și JavaScript cu gzip dacă browserul acceptă acest
format. Oprește-l cu `Ctrl+C`.

Build-ul:

- include nouă pagini și o pagină 404; cele șapte pagini comerciale sunt indexabile,
  iar paginile juridice rămân `noindex, follow`;
- folosește copiile optimizate din `assets/optimized`;
- generează CSS și JavaScript comprimate, cu hash în numele fișierului;
- elimină codul nefolosit din JavaScript separat pentru fiecare pagină;
- încarcă asistentul global la interacțiune și permite reîncercarea dacă fișierul
  nu se poate încărca;
- generează navigarea, subsolul și cele 60 de produse direct în HTML, folosind
  aceleași date și funcții ca versiunea interactivă;
- găzduiește local fontul Manrope și fotografiile paginii principale;
- adaugă imagini responsive, dimensiuni și favicon-uri mici;
- generează URL-uri canonice și sitemap pentru `https://adazrenov.fr`;
- adaugă date structurate pentru pagini, navigare și lista de produse, fără
  oferte sau recenzii inventate;
- generează reguli de cache în `_headers`, inclusiv `noindex` pentru domeniile
  temporare `pages.dev`;
- aplică CSP, protecție împotriva încadrării în iframe și permisiuni limitate;
  aceleași antete sunt active în previzualizarea locală;
- generează metadate Open Graph și Twitter pentru paginile comerciale;
- verifică automat paginile generate, sitemap-ul, linkurile și ancorele interne,
  imaginile, datele structurate, favicon-ul și fișierele de securitate;
- exclude sursele backend, documentația, originalele media, fișierele `.env`,
  logurile și `node_modules`;
- refuză fișierele de cel puțin 25 MiB și peste 20.000 de fișiere.

## Configurarea Cloudflare Pages

În Cloudflare, creează un proiect **Pages**, conectează repository-ul GitHub și
alege ramura de producție `main`.

| Setare | Valoare |
| --- | --- |
| Framework preset | None |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | rădăcina repository-ului |
| Node.js version | `22` (din `.node-version`) |

Fișierele optimizate, scripturile de build și `package-lock.json` trebuie să fie
în repository. `dist` se generează automat și nu trebuie comis în Git.

După verificarea adresei temporare `pages.dev`, adaugă `adazrenov.fr` și
`www.adazrenov.fr` în **Custom domains**. Pentru domeniul principal, adaugă zona
DNS în Cloudflare și înlocuiește serverele DNS la OVH cu cele atribuite de
Cloudflare. Dacă există email pe domeniu, verifică în prealabil înregistrările
MX/TXT necesare.

Configurarea DNS, certificatul HTTPS, redirectarea `www` către domeniul principal
și testarea serviciilor externe se verifică după conectarea conturilor.
Redirectarea `www` către domeniul principal se configurează în Cloudflare,
folosind o regulă de redirectare la nivel de domeniu. Fișierul Pages `_redirects`
acceptă căi relative ca sursă și nu poate defini această regulă între domenii.
Vezi [ghidul oficial pentru redirectarea www](https://developers.cloudflare.com/pages/how-to/www-redirect/).

## Verificări SEO după conectarea domeniului

Proprietatea `https://adazrenov.fr/` este deja verificată în Google Search Console,
iar `https://adazrenov.fr/sitemap.xml` este înregistrat și a fost citit fără erori.
La verificarea din 19 octombrie 2026, șase dintre cele șapte pagini comerciale erau
indexate; `/services` era încă necunoscută pentru Google. După publicarea versiunii
noi, inspectează această adresă și folosește „Request indexing” din interfața GSC.
Verifică datele structurate și performanța pe dispozitive reale. Verificările locale
confirmă funcționarea tehnică;
poziționarea în căutări depinde și de conținut, concurență și reputația firmei.

`sitemap.xml` conține numai adrese canonice HTTPS fără extensie. Nu include
fișierele de verificare Google, pagina 404 sau paginile juridice. Nu se adaugă date
`lastmod` artificiale la fiecare build. Dacă se adaugă o pagină nouă indexabilă,
actualizează și lista din fișierul sursă `sitemap.xml`; verificarea automată semnalează
orice diferență față de sitemap-ul generat.

Verificările se pot repeta separat cu `npm run check`, după `npm run build`.

## security.txt și antetele de securitate

Fișierul de contact pentru raportarea vulnerabilităților este
`/.well-known/security.txt`. Adresa `/security.txt` redirecționează permanent către
acest fișier. Conține adresa publică a firmei și expiră la
`2027-10-13T23:59:59Z`; datele trebuie reverificate înainte de expirare. Build-ul
refuză un fișier expirat și avertizează în ultimele 30 de zile de valabilitate.
Fișierul este un canal de contact și nu înlocuiește protecția aplicației.

Politica CSP este definită în `scripts/site-policy.cjs`. Permite resursele proprii,
Cloudflare Turnstile, Worker-ul ADAZAI, harta Google încărcată după consimțământ,
Google Analytics fără funcții publicitare și beacon-ul Cloudflare. Sunt păstrate
stilurile inline necesare interfeței; scripturile inline executabile și `eval`
sunt blocate. Înainte de adăugarea unui nou furnizor extern, verifică directivele.

După publicare, verifică antetele pe domeniul public și formularul cu Turnstile.
Cheia de producție nu permite localhost; eroarea locală `110200` este separată de
CSP și nu trebuie rezolvată prin dezactivarea protecției.

Sediul firmei este la Noiseau. Zona principală de intervenție, confirmată de
proprietar, cuprinde toate cele opt departamente din Île-de-France. Pentru
șantiere de amploare sunt posibile deplasări în toată Franța, după discutarea
proiectului. Informațiile comerciale suplimentare și exemplele locale trebuie
confirmate înainte de adăugarea unor pagini pentru alte localități.

## Optimizarea unor fișiere media noi

Originalele rămân în `assets`. Scriptul creează copii cu nume ce includ un hash
și actualizează `scripts/media-manifest.json`.

Este nevoie de Python cu Pillow și de FFmpeg. Opțional, FFmpeg poate fi furnizat
de pachetul Python `imageio-ffmpeg`; se poate folosi și variabila `FFMPEG_EXE`.

```bash
npm run media:optimize
npm run build
```

Nu modifica manual o copie cu hash din `assets/optimized`. Actualizează originalul,
rulează optimizarea și include noile copii și manifestul în Git.

## Formulare și backend

Formularul de contact trimite către Worker-ul Cloudflare din `ai-config.js`, care
verifică Turnstile și livrează cererea prin Resend. Asistentul folosește ruta
`/chat` a aceluiași Worker. Codul și secretele Worker-ului se publică separat de
frontend; `dist` nu include sursele backend sau configurații private. Codul
Firebase păstrat în repository nu se publică prin acest build.

Chatul ADAZAI folosește în continuare endpoint-ul din `ai-config.js`. Pentru
testarea chatului pe un domeniu temporar `pages.dev`, originea respectivă trebuie
autorizată în configurația Worker-ului. Domeniile finale `adazrenov.fr` și
`www.adazrenov.fr` sunt deja listate în configurația locală a Worker-ului.

## Documentație oficială

- [Site HTML static pe Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)
- [Limitele Pages](https://developers.cloudflare.com/pages/platform/limits/)
- [Domenii personalizate](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Reguli pentru antete HTTP](https://developers.cloudflare.com/pages/configuration/headers/)
