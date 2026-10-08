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

- include cele opt pagini publice și o pagină 404;
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
Regula de redirectare `www` este inclusă în build, în `_redirects`; ambele domenii
trebuie mai întâi conectate la Pages.

## Verificări SEO după conectarea domeniului

Adaugă domeniul în Google Search Console și trimite
`https://adazrenov.fr/sitemap.xml`. Verifică indexarea paginilor, datele structurate
și performanța pe dispozitive reale. Scorurile locale sunt verificări tehnice;
poziționarea în căutări depinde și de conținut, concurență și reputația firmei.

Adresa firmei existentă în site este Noiseau. Zona efectivă de intervenție și
informațiile comerciale suplimentare trebuie confirmate înainte de adăugarea
unor pagini pentru alte localități.

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

Logica și configurația formularelor au fost păstrate. Integrarea ulterioară cu
Redmine, verificarea trimiterilor și configurarea backend-ului se fac separat.
Cloudflare Pages publică frontend-ul; nu mută automat funcțiile Firebase.

Chatul ADAZAI folosește în continuare endpoint-ul din `ai-config.js`. Pentru
testarea chatului pe un domeniu temporar `pages.dev`, originea respectivă trebuie
autorizată în configurația Worker-ului. Domeniile finale `adazrenov.fr` și
`www.adazrenov.fr` sunt deja listate în configurația locală a Worker-ului.

## Documentație oficială

- [Site HTML static pe Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)
- [Limitele Pages](https://developers.cloudflare.com/pages/platform/limits/)
- [Domenii personalizate](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Reguli pentru antete HTTP](https://developers.cloudflare.com/pages/configuration/headers/)
