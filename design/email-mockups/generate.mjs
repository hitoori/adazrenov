import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { renderContactEmail, renderConfirmationEmail } from '../../cloudflare/adazai-worker/src/email-template.js';

// Render exactly the production templates with fictional data and local images.
// This script never sends emails.
const root = path.dirname(fileURLToPath(import.meta.url));
await mkdir(path.join(root, 'assets'), { recursive: true });
for (const name of ['logo', 'instagram', 'tiktok', 'facebook']) {
  await copyFile(path.join(root, `../../assets/email/v1/${name}.png`), path.join(root, `assets/${name}.png`));
}
await copyFile(path.join(root, '../../assets/fonts/manrope-latin.e310b55a7fd9.woff2'), path.join(root, 'assets/manrope.woff2'));
const sample = {
  name: 'Camille Martin', email: 'camille.martin@example.fr', phone: '06 00 00 00 00',
  service: 'Rénovation de salle de bain',
  message: 'Bonjour,\nJe souhaite rénover une salle de bain de 8 m² à Noiseau : remplacer la baignoire par une douche, refaire le carrelage et installer un nouveau meuble vasque.\nLes travaux seraient à prévoir au printemps. Pourriez-vous me rappeler pour en discuter ?\nMerci et à bientôt.',
};
await writeFile(path.join(root, 'client.html'), renderConfirmationEmail(sample, { assetBase: 'assets' }));
await writeFile(path.join(root, 'equipe.html'), renderContactEmail(sample, { assetBase: 'assets' }));
console.log('Rendered both production email templates with demonstration data. No emails sent.');
