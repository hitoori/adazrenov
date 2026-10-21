// Shared, email-compatible templates for production and local previews.
// Only escaped visitor fields are inserted; recipients and branding stay on the server.
export const EMAIL_ASSET_BASE = 'https://adazrenov.fr/assets/email/v1';
const socialLinks = {
  instagram: 'https://www.instagram.com/adaz_renov',
  tiktok: 'https://www.tiktok.com/@adaz_renov',
  facebook: 'https://www.facebook.com/profile.php?id=61562185566929',
};
const telephone = value => `${String(value).trim().startsWith('+') ? '+' : ''}${String(value).replace(/\D/g, '')}`;

const c = { navy: '#1e3a5f', ink: '#152033', gold: '#d4af7a', muted: '#647089', line: '#e2e8ef', pale: '#f1f5f8' };
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const table = (rows, style = '') => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="${style}">${rows}</table>`;
const p = (text, style = '') => `<p style="margin:0 0 14px;font-size:14px;line-height:23px;${style}">${text}</p>`;
const label = text => p(text, `margin-bottom:8px;font-size:10px;line-height:16px;font-weight:700;letter-spacing:1.3px;color:${c.muted};text-transform:uppercase;`);
const heading = text => `<h2 style="margin:0 0 12px;font-size:17px;line-height:24px;color:${c.navy};">${text}</h2>`;
const row = (name, value) => `<tr><td width="90" style="width:90px;padding:10px 0;vertical-align:top;border-bottom:1px solid ${c.line};font-size:12px;line-height:20px;color:${c.muted};">${name}</td><td style="padding:10px 0;vertical-align:top;border-bottom:1px solid ${c.line};font-size:13px;line-height:20px;color:${c.ink};overflow-wrap:anywhere;">${value}</td></tr>`;
const message = data => p(escape(data.message).replace(/\r\n|\r|\n/g, '<br>'), 'margin:0;font-size:13px;line-height:22px;color:#445269;overflow-wrap:anywhere;');
const divider = content => table(`<tr><td style="padding-top:21px;border-top:1px solid ${c.line};">${content}</td></tr>`, 'margin-top:22px;');

const brand = assetBase => `<table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" style="width:auto;max-width:100%;margin:0 auto 20px;"><tr><td width="60" style="width:60px;vertical-align:middle;"><a href="https://adazrenov.fr"><img src="${assetBase}/logo.png" width="46" height="52" alt="Logo ADAZ RENOV" style="display:block;width:46px;height:52px;border:0;"></a></td><td style="vertical-align:middle;text-align:left;"><p class="brand-title" style="margin:0 0 3px;font-size:23px;line-height:28px;font-weight:700;letter-spacing:-.5px;color:#fff;">ADAZ RENOV</p><p class="brand-tagline" style="margin:0;color:#d8e3ed;font-size:10px;line-height:16px;letter-spacing:1px;">RÉNOVATION &amp; CONSTRUCTION</p></td></tr></table>`;

function socialSection(assetBase) {
  const platforms = [['instagram', 'Instagram'], ['tiktok', 'TikTok'], ['facebook', 'Facebook']];
  return `<table role="presentation" width="330" align="center" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:330px;margin:11px auto 0;table-layout:fixed;"><tr>${platforms.map(([key, text]) => `<td width="33.33%" style="width:33.33%;padding:0 3px;text-align:center;"><a href="${socialLinks[key]}" target="_blank" rel="noopener noreferrer" aria-label="${text} ADAZ RENOV" style="display:block;padding:10px 3px;border:1px solid #dce4ec;border-radius:6px;background-color:#ffffff;text-align:center;text-decoration:none;white-space:nowrap;font-size:10px;line-height:18px;color:${c.navy};"><img src="${assetBase}/${key}.png" width="16" height="16" alt="" style="display:inline-block;vertical-align:middle;width:16px;height:16px;margin-right:4px;border:0;"><span style="vertical-align:middle;">${text}</span></a></td>`).join('')}</tr></table>`;
}

function phoneSection() {
  return table(`<tr><td style="padding:17px 18px;">${p('Vous préférez nous appeler ?', `margin-bottom:4px;font-size:15px;line-height:22px;font-weight:700;color:${c.navy};`)}${p('Du lundi au vendredi, de 9 h à 17 h.', 'margin-bottom:13px;font-size:12px;line-height:19px;color:#647089;')}${table(`<tr><td width="50%" style="width:50%;padding-right:6px;vertical-align:top;">${label('Fixe')}<a class="phone-number" href="tel:+33186047468" style="color:${c.navy};font-size:19px;line-height:25px;font-weight:700;text-decoration:none;white-space:nowrap;">01 86 04 74 68</a></td><td width="50%" style="width:50%;padding-left:6px;vertical-align:top;">${label('Mobile')}<a class="phone-number" href="tel:+33652317288" style="color:${c.navy};font-size:19px;line-height:25px;font-weight:700;text-decoration:none;white-space:nowrap;">06 52 31 72 88</a></td></tr>`, 'table-layout:fixed;')}</td></tr>`, `margin:20px 0 0;background-color:${c.pale};border-radius:10px;`);
}

const button = (text, href, secondary = false) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;"><tr><td align="center" bgcolor="${secondary ? '#fff' : c.navy}" style="background-color:${secondary ? '#fff' : c.navy};border:1px solid ${secondary ? '#c9d5e1' : c.navy};border-radius:7px;text-align:center;mso-padding-alt:12px 8px;"><a class="email-action" href="${href}" style="display:block;padding:12px 8px;font-size:13px;line-height:20px;font-weight:700;text-align:center;white-space:nowrap;text-decoration:none;color:${secondary ? c.navy : '#fff'};">${text}</a></td></tr></table>`;
const teamActions = data => table(`<tr><td width="50%" style="width:50%;padding-right:4px;vertical-align:top;">${button('Appeler le client', `tel:${telephone(data.phone)}`)}</td><td width="50%" style="width:50%;padding-left:4px;vertical-align:top;">${button('Répondre par e-mail', `mailto:${encodeURIComponent(data.email)}`, true)}</td></tr>`, 'table-layout:fixed;margin-top:16px;');

function footer(internal, assetBase) {
  const company = p('<strong style="color:#1e3a5f;">ADAZ RENOV</strong> · Rénovation &amp; construction', 'margin:0 0 5px;text-align:center;color:#647089;font-size:11px;line-height:18px;');
  const details = p('1 Place du Vieux Pays, 94880 Noiseau<br><a href="https://adazrenov.fr" style="color:#1e3a5f;text-decoration:underline;text-underline-offset:2px;">adazrenov.fr</a> &nbsp;·&nbsp; <a href="mailto:adazrenov@gmail.com" style="color:#1e3a5f;text-decoration:underline;text-underline-offset:2px;">adazrenov@gmail.com</a>', 'margin:0;text-align:center;color:#647089;font-size:11px;line-height:20px;');
  const privacy = p(internal ? 'Notification interne · Formulaire Contact du site.<br>Les coordonnées servent au suivi de cette demande.' : 'Cet e-mail confirme votre demande sur notre site.<br><a href="https://adazrenov.fr/politique-confidentialite.html" style="color:#647089;text-decoration:underline;">Confidentialité de vos données</a>', 'margin:12px 0 0;text-align:center;font-size:10px;line-height:17px;color:#647089;');
  return `<tr><td class="padding" align="center" style="padding:18px 30px;background-color:#f6f7f9;border-top:1px solid ${c.line};text-align:center;">${company}${details}${socialSection(assetBase)}${privacy}</td></tr>`;
}

function shell(title, preheader, heroTitle, heroLine, content, internal = false, assetBase = EMAIL_ASSET_BASE) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escape(title)}</title>
<style>body{margin:0;padding:0}table{border-collapse:separate}a:focus-visible{outline:2px solid #d4af7a;outline-offset:4px}@media only screen and (max-width:480px){.outer{padding:12px 8px!important}.padding{padding-left:20px!important;padding-right:20px!important}.hero-title{font-size:25px!important;line-height:31px!important}.brand-title{font-size:22px!important}.brand-tagline{font-size:9px!important;letter-spacing:.7px!important}.phone-number{font-size:17px!important;line-height:24px!important;letter-spacing:-.4px!important}.email-action{font-size:12px!important;padding:11px 5px!important;letter-spacing:-.2px!important}}@media only screen and (max-width:360px){.phone-number{font-size:14px!important;line-height:22px!important}.email-action{font-size:11px!important}}</style></head>
<body style="margin:0;padding:0;background-color:#eef2f6;color:${c.ink};font-family:Arial,Helvetica,sans-serif;"><div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escape(preheader)}</div>
${table(`<tr><td class="outer" align="center" style="padding:24px 16px;">${table(`<tr><td class="padding" bgcolor="${c.navy}" style="padding:23px 30px 24px;background-color:${c.navy};">${brand(assetBase)}<h1 class="hero-title" style="margin:0;color:#fff;font-size:28px;line-height:35px;letter-spacing:-.5px;">${heroTitle}</h1>${p(heroLine, 'margin:9px 0 0;font-size:13px;line-height:21px;color:#e2c79f;')}</td></tr><tr><td height="3" bgcolor="${c.gold}" style="height:3px;font-size:0;line-height:0;">&nbsp;</td></tr><tr><td class="padding" style="padding:26px 30px;">${content}</td></tr>${footer(internal, assetBase)}`, 'width:100%;max-width:600px;background-color:#fff;border:1px solid #dde5ed;border-radius:13px;overflow:hidden;')}</td></tr>`)}
</body></html>`;
}


export function renderConfirmationEmail(data, { assetBase = EMAIL_ASSET_BASE } = {}) {
const clientContent = `${p(`Bonjour ${escape(data.name)},`, 'font-weight:700;')}${p(`Nous avons bien reçu votre demande. Un membre de notre équipe vous appellera au <strong>${escape(data.phone)}</strong> dans un délai maximum de <strong>24 heures</strong> pour parler de votre projet et répondre à vos questions.`)}
${p('À bientôt,<br><strong style="color:#1e3a5f;">L’équipe ADAZ RENOV</strong>', 'margin:17px 0 0;font-size:13px;line-height:21px;')}
${divider(`${heading('Votre demande')}${table(`${row('Nom', escape(data.name))}${row('Téléphone', escape(data.phone))}${row('E-mail', escape(data.email))}${row('Projet', escape(data.service))}`, 'table-layout:fixed;margin-bottom:16px;')}${label('Votre message')}${message(data)}`)}
${phoneSection()}`;


  return shell('Nous avons reçu votre demande — ADAZ RENOV', 'Notre équipe vous rappelle dans un délai maximum de 24 heures.', 'Merci pour votre message.', 'Notre équipe vous rappelle sous 24 heures.', clientContent, false, assetBase);
}

export function renderContactEmail(data, { assetBase = EMAIL_ASSET_BASE } = {}) {
const teamContent = `${p(`<strong>${escape(data.name)}</strong> a envoyé une demande depuis le site.`, 'margin-bottom:17px;')}
${table(`<tr><td style="padding:13px 16px;border-left:3px solid ${c.gold};background-color:#f5f3ee;">${p('À rappeler sous 24 heures', `margin-bottom:3px;font-size:15px;line-height:22px;font-weight:700;color:${c.navy};`)}${p('Pour faire le point sur les travaux et convenir de la suite.', 'margin:0;font-size:12px;line-height:20px;color:#647089;')}</td></tr>`, 'margin-bottom:20px;')}
${label('Le client')}<h2 style="margin:0 0 4px;font-size:23px;line-height:30px;letter-spacing:-.4px;color:#1e3a5f;">${escape(data.name)}</h2>${p(escape(data.service), 'margin:0;font-size:13px;line-height:21px;color:#647089;')}
${table(`${row('Téléphone', `<a href="tel:${telephone(data.phone)}" style="color:#1e3a5f;text-decoration:none;font-weight:700;">${escape(data.phone)}</a>`)}${row('E-mail', `<a href="mailto:${encodeURIComponent(data.email)}" style="color:#1e3a5f;text-decoration:underline;">${escape(data.email)}</a>`)}`, 'margin-top:15px;table-layout:fixed;')}
${divider(`${heading('Son message')}${message(data)}`)}
${teamActions(data)}`;


  return shell('Nouvelle demande de devis — ADAZ RENOV', `${data.name} · ${data.service} · À rappeler sous 24 heures`, 'Nouvelle demande de devis', escape(data.service), teamContent, true, assetBase);
}
