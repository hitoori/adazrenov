# ADAZAI Cloudflare Worker

Backend Cloudflare pentru chatul ADAZRENOV. Consumul OpenAI este facturat separat;
Cloudflare aplică limitele planului contului folosit.

- cheia OpenAI este stocata ca Cloudflare Worker Secret;
- conversatiile sunt pastrate in D1;
- OpenAI Responses API foloseste `store: false`;
- browserul nu primeste niciodata cheia.

## Instrucțiuni și informații despre firmă

`src/assistant-prompt.js` definește tonul, regulile și selecția referințelor.
`src/site-knowledge.js` se regenerează prin `npm run build` din rădăcina site-ului:
90 de pagini, servicii, produse, proiecte și răspunsuri FAQ, fără configurări,
formulare sau date ale clienților. Modificările site-ului necesită și republicarea
workerului pentru a actualiza informațiile asistentului.

Fiecare cerere folosește identitatea firmei, contactele, FAQ-ul, prezentarea
serviciilor și a catalogului, plus până la șase
referințe relevante. Istoricul recent și contextul formularului personalizează
răspunsurile. Prețurile sunt indicative; asistentul nu confirmă rezervări.
Asistentul rămâne exclusiv în franceză. Mesajele identificate ca fiind în alte
limbi primesc o invitație prestabilită de a reformula, fără apel OpenAI.
Nu are acces la stocuri, planning sau noutăți în timp real.

OpenAI returnează separat răspunsul, până la două întrebări de continuare și
până la două linkuri utile. Întrebările sunt butoane care trimit mesaje; linkurile
pot naviga doar către referințe cunoscute ale site-ului. Nu se adaugă automat
surse FAQ după fiecare răspuns. Numai mesajele asistentului au animație de scriere.

Interfața păstrează mesajele, orele și ID-ul conversației în `sessionStorage`
pentru tabul curent. La închidere, navigare sau trecerea tabului în fundal,
istoricul poate fi reluat timp de 60 de secunde. Chatul deschis și vizibil menține
sesiunea activă. Pagina următoare păstrează chatul închis; expirarea este verificată
și de loader, fără deschiderea asistentului. Butonul « Effacer » resetează imediat
istoricul interfeței și ID-ul, păstrând limitele de consum. Această resetare nu
șterge înregistrările backend din D1. Linkurile folosesc tabul curent; butonul de
copiere a fost eliminat.

Modelul implicit este `gpt-4o-mini`, cu maximum 600 tokenuri de răspuns.
Există o limită de 30 cereri / 10 minute per IP, 20 cereri / zi per IP și 100
cereri / zi pentru worker. Limitele zilnice se resetează la 00:00 UTC; persoanele
care folosesc același IP împart limita. Aceste limite se aplică pe server,
independent de închiderea chatului sau de ștergerea stocării browserului.
După o limită, API-ul returnează `mode: simple` și timpul până la resetare.
Interfața păstrează întrebările prestabilite în franceză cu răspunsuri locale,
etichetate « Réponse prédéfinie · sans IA », fără apeluri OpenAI până la resetare.
Aceasta este o limită de cereri, nu un plafon monetar. Nu se face retry pe erori
de autentificare, credit sau rate limit. Erorile nu sunt mascate prin răspunsuri
generice care par generate de OpenAI.

## Protejarea cheii

Cheia se configurează exclusiv ca Secret `OPENAI_API_KEY` în workerul contului
Cloudflare corect, niciodată în `vars`, `ai-config.js`, HTML sau GitHub.
Cloudflare criptează secretul la stocare; serverul îl folosește pentru apelul
HTTPS către OpenAI. Nu se adaugă criptare în browser și nu se trimite cheia
clientului. Administratorii cu drepturi de publicare trebuie să rămână persoane
de încredere: codul workerului are acces la secret în timpul execuției.

Fișierele locale `.env*` și `.dev.vars*` sunt ignorate de Git. Buildul public
copiază doar fișierele site-ului, nu workerul sau fișierele cu secrete.
Răspunsurile nu sunt cache-uite; logurile nu includ conținutul erorilor OpenAI,
promptul, mesajele sau cheia. `store: false` nu șterge istoricul din D1 și nu
reprezintă singur o garanție de zero data retention din partea OpenAI.

Workerul este publicat în contul ADAZRENOV, cu secretul configurat direct în
Cloudflare. Două cereri reale au verificat răspunsurile și continuitatea
conversației. `useOpenAIForSuggestions: true` este activat în configurația
locală; publicarea site-ului actualizează și comportamentul sugestiilor live.

Folosește `npm run deploy` pentru republicarea workerului. Comanda păstrează
secretul existent din Cloudflare și exclude cheile din mediul terminalului,
`.env` și `.dev.vars`, astfel încât o cheie locală să nu înlocuiască accidental
cheia de producție.

Referințe oficiale:
- https://developers.cloudflare.com/workers/configuration/secrets/
- https://developers.openai.com/api/docs/guides/text
- https://developers.openai.com/api/docs/models/gpt-4o-mini

## Formularul Contact prin Resend

Workerul acceptă doar `POST /contact` pentru e-mailuri. `POST /booking` este
dezactivat și returnează 404. Assistant nu trimite cereri prin e-mail.
Expeditorul `RESEND_FROM`
și destinatarul `CONTACT_TO` sunt configurate numai pe server; destinatarul
curent este `octavian.chiticgd@gmail.com`. Pentru schimbarea lui, actualizează
`CONTACT_TO` în `wrangler.jsonc` și republică workerul. `RESEND_API_KEY` trebuie
salvat ca Secret Cloudflare, cu drepturi Resend « Sending access » limitate la
`adazrenov.fr`. Domeniul trebuie să fie verificat de Resend înaintea activării.

În `ai-config.js`, activarea folosește `deliveryProvider: "resend"`,
`preferFunctions: true` și `apiUrl: "https://adazai-api.adazrenov.workers.dev/contact"`
pentru contact. Configurația de trimitere a Assistant este dezactivată.
După activare, elimină cheia Web3Forms.
Un eșec Resend nu trimite datele automat unui alt furnizor.

E-mailurile merg doar la firmă; clientul nu primește o confirmare automată.
Adresa clientului este folosită ca `reply_to`. Conținutul formularului nu este arhivat în D1; ajunge în Resend și în căsuța destinatarului.
Limitele sunt separate de chat: 3 cereri/10 minute și 10/24 ore per IP,
50/24 ore pentru toate formularele. Un câmp ascuns blochează spamul simplu.
Aceste limite nu înlocuiesc o verificare CAPTCHA. Resend primește un identificator
unic pentru a evita dublarea aceleiași cereri la reluarea după o eroare de rețea.
Testele simulează serviciul; nu trimit e-mailuri reale.

Documentație: https://resend.com/docs/api-reference/emails/send-email

## Verificare fără consum OpenAI

```bash
npm test
npm run deploy -- --dry-run
```

Testele simulează OpenAI și D1; nu folosesc cheia din mediul local și nu consumă
credit. O cerere reală rămâne necesară după activarea secretului.

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
