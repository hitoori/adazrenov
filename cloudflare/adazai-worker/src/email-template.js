function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function detailRow(label, value) {
  return `<tr><td style="padding:12px 0;border-bottom:1px solid #e8edf2;vertical-align:top;width:104px;color:#66758a;font-size:13px;line-height:21px;">${label}</td><td style="padding:12px 0;border-bottom:1px solid #e8edf2;vertical-align:top;color:#142840;font-size:15px;line-height:21px;word-break:break-word;">${value}</td></tr>`;
}

export function renderContactEmail({ title, name, email, phone, service, message }) {
  const telephone = `${phone.trim().startsWith('+') ? '+' : ''}${phone.replace(/\D/g, '')}`;
  const nextStep = 'Appelez le client pour préciser ses besoins et convenir de la suite.';
  const preheader = `${name} · ${service} · ${phone}`;
  const emailValue = email
    ? `<a href="mailto:${encodeURIComponent(email)}" style="color:#1e3a5f;text-decoration:underline;">${escapeHtml(email)}</a>`
    : '<span style="color:#66758a;">Non renseigné</span>';
  const requestMessage = escapeHtml(message || 'Aucun message complémentaire.').replace(/\r\n|\r|\n/g, '<br>');

  // Tables and inline styles keep the request readable in email clients.
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title>
<style>@media only screen and (max-width:620px){.email-shell{width:100%!important}.email-outer{padding:12px 8px!important}.email-content{padding:24px 20px!important}.email-heading{font-size:25px!important;line-height:32px!important}.email-call{display:block!important;text-align:center!important}}</style>
</head><body style="margin:0;padding:0;background-color:#f3f5f8;color:#142840;font-family:Arial,Helvetica,sans-serif;">
<div style="display:none;font-size:1px;line-height:1px;color:#f3f5f8;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader.slice(0, 180))}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f3f5f8"><tr><td class="email-outer" align="center" style="padding:32px 16px;">
<table role="presentation" class="email-shell" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid #e2e8ef;border-radius:16px;overflow:hidden;">
<tr><td bgcolor="#1e3a5f" style="padding:26px 32px;background-color:#1e3a5f;border-radius:15px 15px 0 0;">
  <p style="margin:0;color:#ffffff;font-size:23px;line-height:29px;font-weight:700;letter-spacing:1px;">ADAZ RENOV</p>
  <p style="margin:6px 0 0;color:#d2dce8;font-size:10px;line-height:16px;letter-spacing:1.5px;">RÉNOVATION &amp; CONSTRUCTION</p>
</td></tr>
<tr><td height="4" bgcolor="#d4af7a" style="height:4px;background-color:#d4af7a;font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td class="email-content" style="padding:30px 32px 32px;">
  <p style="margin:0 0 12px;color:#6c5b40;font-size:11px;line-height:16px;letter-spacing:1px;font-weight:700;text-transform:uppercase;">Formulaire Contact · À contacter</p>
  <h1 class="email-heading" style="margin:0;color:#1e3a5f;font-size:29px;line-height:36px;font-weight:700;">${escapeHtml(title)}</h1>
  <p style="margin:12px 0 24px;color:#66758a;font-size:14px;line-height:22px;">${nextStep}</p>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f3f6fa" style="background-color:#f3f6fa;border:1px solid #e3e9f0;border-radius:12px;"><tr><td style="padding:20px;">
    <p style="margin:0 0 6px;color:#66758a;font-size:11px;line-height:16px;font-weight:700;letter-spacing:1px;">CLIENT À RAPPELER</p>
    <p style="margin:0;color:#142840;font-size:21px;line-height:28px;font-weight:700;word-break:break-word;">${escapeHtml(name)}</p>
    <p style="margin:8px 0 17px;font-size:22px;line-height:28px;"><a href="tel:${telephone}" style="color:#1e3a5f;text-decoration:none;font-weight:700;">${escapeHtml(phone)}</a></p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#1e3a5f" style="background-color:#1e3a5f;border-radius:8px;mso-padding-alt:12px 22px;"><a class="email-call" href="tel:${telephone}" style="display:inline-block;padding:12px 22px;color:#ffffff;font-size:14px;line-height:20px;font-weight:700;text-decoration:none;">Appeler le client</a></td></tr></table>
  </td></tr></table>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;table-layout:fixed;">
    ${detailRow('Travaux', escapeHtml(service))}
    ${detailRow('E-mail', emailValue)}
  </table>
  <h2 style="margin:26px 0 12px;color:#1e3a5f;font-size:17px;line-height:24px;">La demande du client</h2>
  <div style="padding:18px 20px;background-color:#fafbfd;border:1px solid #e8edf2;border-radius:10px;color:#283c54;font-size:15px;line-height:24px;word-break:break-word;overflow-wrap:anywhere;">${requestMessage}</div>
</td></tr>
<tr><td align="center" bgcolor="#f8f9fb" style="padding:17px 24px;background-color:#f8f9fb;border-top:1px solid #e8edf2;border-radius:0 0 15px 15px;color:#7b8796;font-size:11px;line-height:18px;">Demande reçue depuis adazrenov.fr · Équipe ADAZ RENOV</td></tr>
</table></td></tr></table></body></html>`;
}
