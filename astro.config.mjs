import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * GH_PAGES=1 → copia temporal en https://jrsepul2020.github.io/autocaravanasrgmega/
 * (subcarpeta, noindex y robots.txt bloqueado). Sin la variable → web oficial (Nominalia).
 */
const PAGES = process.env.GH_PAGES === '1';
const BASE = '/autocaravanasrgmega';

/** Añade la subcarpeta a los enlaces absolutos ("/tarifas/") del HTML ya generado. */
const ghPagesPaths = () => ({
  name: 'gh-pages-paths',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      if (!PAGES) return;
      const root = fileURLToPath(dir);
      const walk = async (d) => (await readdir(d, { recursive: true })).map((f) => join(d, f));
      const prefix = (s) => s
        .replace(/(\s(?:href|src|action|poster)=["'])\/(?!\/|autocaravanasrgmega\/)/g, `$1${BASE}/`)
        .replace(/(url=)\/(?!\/|autocaravanasrgmega\/)/g, `$1${BASE}/`);
      for (const f of await walk(root)) {
        if (f.endsWith('.html')) await writeFile(f, prefix(await readFile(f, 'utf8')));
      }
      await writeFile(join(root, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
      console.log('[gh-pages] Enlaces adaptados a', BASE);
    },
  },
});

export default defineConfig({
  site: PAGES ? 'https://jrsepul2020.github.io' : 'https://autocaravanasrgmega.com',
  base: PAGES ? BASE : undefined,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !/\/(gracias|404)\/?$/.test(page),
      i18n: undefined,
    }),
    ghPagesPaths(),
  ],
  // Redirecciones 301 de URLs antiguas del WordPress (también en public/.htaccess y public/_redirects)
  redirects: {
    '/inicio/': '/',
    '/inicio-3/': '/',
    '/calendarios/': '/calendario-disponibilidad/',
    '/calendario/': '/calendario-disponibilidad/',
    '/modelos-de-autocaravanas-en-alquiler/': '/#autocaravanas',
    '/tarifa-alquilar-autocaravana-mileo-268/': '/tarifas/',
    '/autocaravanas/benimar-t463-up-ford-165cv/': '/',
  },
});
