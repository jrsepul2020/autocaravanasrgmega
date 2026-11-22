# RG MEGA Autocaravanas — nueva web (Astro)

Web estática, rápida y orientada a SEO local y conversión para **autocaravanasrgmega.com**.

## Comandos

```bash
npm install          # primera vez
npm run dev          # desarrollo en http://localhost:4321
npm run build        # genera la web final en /dist
npm run preview      # previsualiza /dist
```

Para publicar en **Nominalia**: `npm run build` y sube por FTP el **contenido** de `dist/` a la carpeta pública del dominio (normalmente `public_html/`). Incluye `.htaccess` con las redirecciones 301 (asegúrate de que tu cliente FTP muestra y sube archivos ocultos).

---

## Manual del administrador

Todo lo editable está en **`src/data/`**:

| Qué cambiar | Archivo |
|---|---|
| Teléfono, email, horario, dirección, redes | `src/data/site.ts` |
| **Precios** por temporada | **Google Sheets** (ver abajo). Valores de respaldo: `src/data/vehicles.ts` |
| Fechas de temporada especial (puentes, Navidad, Feria, Rocío…) | **Google Sheets**. Respaldo: `src/data/site.ts` → `specialDates` |
| Ofertas del banner | **Google Sheets**. Respaldo: `src/data/site.ts` → `offers` |
| Preguntas frecuentes | `src/data/faqs.ts` |
| Rutas | `src/data/rutas.ts` |

### Precios, ofertas y fechas especiales (Google Sheets)
Se gestionan desde una hoja de Google, **sin tocar código ni volver a subir la web**.

**Puesta en marcha (una sola vez)**
1. Sube `admin/plantilla-precios-rgmega.xlsx` a Google Drive → clic derecho → *Abrir con → Hojas de cálculo de Google* → *Archivo → Guardar como Hojas de cálculo de Google*.
2. Comprueba que las pestañas se llaman exactamente **Portada**, **Ofertas**, **Precios** y **Fechas especiales** (las columnas se reconocen por su título, puedes reordenarlas).
3. *Compartir* → Acceso general: **Cualquier persona con el enlace** → **Lector**.
4. Copia el ID de la URL (`https://docs.google.com/spreadsheets/d/`**ESTE_ID**`/edit`) y pégalo en `src/data/sheet.ts` → `sheetId`. Después `npm run build` y sube `dist/`.

Hoja actual: https://docs.google.com/spreadsheets/d/15ci4BIAbpV3NxUKtrd-QioHKiVRa55dwzitK-7Ho0TY/edit

**Uso diario**
- **Portada**: el precio destacado del inicio ("Camper 120 UP desde 110 €/día"). Elige vehículo, el texto que va delante y, si quieres anunciar un precio concreto, escríbelo; vacío = el más bajo de ese vehículo.
- **Ofertas**: una fila por mini banner (portada y página de Ofertas). `SI` para mostrarla, `NO` para ocultarla; caducan solas al pasar "Válida hasta". Las columnas **Vehículo** y **Precio desde €/día** dan la foto del vehículo y el precio grande en rojo. **Precio antes €/día (opcional)** sale tachado con el sello de % de descuento; si lo dejas vacío, se compara con la tarifa habitual más baja de ese vehículo. El sello solo aparece si el descuento es de un 5 % o más, y "Quedan X días" sale cuando faltan 30 días o menos para "Válida hasta". No escribas el precio dentro del texto. Por ley, el "precio antes" debe ser el más bajo que hayas aplicado en los 30 días previos a la rebaja.
- **Precios**: cambia solo los números (€/día) de las columnas C (3-14 días) y D (15 días o más). No cambies los nombres de vehículo ni de temporada.
- **Fechas especiales**: nombre, desde y hasta (dd/mm/aaaa, ambos días incluidos). Esos días se cobran a tarifa de temporada especial en el calculador.
- Los cambios se ven en la web en **unos 5 minutos** (precios de tablas, "desde", tarjetas, ficha de cada vehículo, ofertas, fechas especiales y el calculador del formulario).
- No mezcles texto y números/fechas en una misma columna (Google descarta los valores que no encajan).

**Para Google (SEO)**: los títulos, descripciones, preguntas frecuentes y datos estructurados se escriben con los precios de la hoja **al compilar**. Si cambias mucho los precios, haz `npm run build` y vuelve a subir `dist/` cuando puedas para que Google vea los nuevos (los visitantes ya los ven al momento).

Si la hoja no responde o se deja de compartir, la web usa automáticamente los precios guardados en el código.

### Carrusel de fotos
Sube las fotos a **`src/assets/carrusel/`** (jpg, png o webp, idealmente horizontales y de al menos 1600 px de ancho). La web las comprime y convierte a WebP sola.
- Se ordenan por nombre: `01-…`, `02-…`, `03-…`
- El nombre del archivo es el texto alternativo y el pie de foto (cuenta para SEO): `12-mileo-268-en-la-playa-de-bolonia.jpg` → "Mileo 268 en la playa de bolonia".
- Para quitar una foto, bórrala de la carpeta. Después, `npm run build` y subir `dist/`.
- Aparece en la home y en las páginas de camper, fin de semana, puentes y ofertas.

### Colores
Definidos en `src/styles/global.css` (`:root`): verde `#3C5F4D` (y oscuro `#22392E` para bloques importantes con texto blanco), naranja corporativo `#F6AE2D` (botones), rojo `#D62828` (precios), pasteles verdes `#EEF5F0` / `#D3E6DA` para fondos suaves, y un ámbar oscuro `#9A6406` solo para textos sobre fondo claro.

### Calendario de disponibilidad (Google Calendar)
Se mantiene **igual que ahora**: en Google Calendar, en el calendario "Mileo 268" o "Camper 120 UP", crea un **evento de día completo** con el título `RESERVADA …` que cubra los días ocupados. La web lo marca en rojo al instante (sin tocar la web).
- Los eventos con "DISPONIBLE" o "LIBRE" en el título se ignoran.
- Recuerda: en Google, un evento de día completo del 13 al 16 termina el 15 (el 16 queda libre).
- Si la API fallara, la web muestra automáticamente el calendario de Google incrustado.
- Recomendado: en Google Cloud Console, restringe la clave API a `autocaravanasrgmega.com/*`.

### Instagram (LightWidget)
En lightwidget.com → tu widget → *Get code*, copia el ID de `lightwidget.com/widgets/XXXXXXXX.html` y pégalo en `site.ts → lightwidgetId`. Se carga solo al llegar a esa sección (no ralentiza la web).

### Formulario
- Sin configurar: el formulario envía la consulta por **WhatsApp** con fechas, modelo y precio estimado.
- Para recibirla también por **email**: crea una clave gratuita en web3forms.com con `autocaravanasrgmega@gmail.com` y pégala en `site.ts → web3formsKey`.

### Google Business Profile
- Pega en `site.ts → gbpReviewUrl` el enlace "Pedir reseñas" de tu ficha.
- Opcional: sustituye `mapEmbed` por el iframe de *Compartir → Insertar mapa* de tu ficha.
- La web incluye datos estructurados `AutoRental/LocalBusiness` con el mismo nombre, dirección, teléfono y horario (NAP): **mantén esos datos idénticos a la ficha de Google**.

### Pendiente de completar
- `aviso-legal` y `politica-de-privacidad`: titular y NIF (marcados como `[NOMBRE]`, `[NIF]`).

---

## Estrategia SEO (resumen)

**Diagnóstico Search Console (16 meses):** 272 clics / 4.767 impresiones. La home recibe el 80 % de clics pero posiciona en el puesto ~30; las búsquedas con dinero ("alquiler autocaravanas sevilla", "…precios", "alquiler camper sevilla", "…baratas") tienen cientos de impresiones en posición 45-80 y **0 clics**. Había páginas duplicadas (`/inicio/`, `/inicio-3/`, `/calendario/`, `/calendarios/`…) canibalizando. El 78 % de los clics vienen de móvil.

**Arquitectura: una página por intención de búsqueda**

| Página | Búsquedas objetivo |
|---|---|
| `/` | alquiler autocaravanas sevilla, alquiler de autocaravanas en sevilla, autocaravanas sevilla |
| `/tarifas/` | alquiler autocaravanas sevilla precios, precio alquiler autocaravana sevilla |
| `/alquilar-benimar-mileo-268/` | benimar mileo 268, alquiler mileo 268, alquiler benimar |
| `/alquilar-camper-120-up/` | camper 120 up, benimar 120 up alquiler |
| `/alquiler-camper-sevilla/` | alquiler camper sevilla, alquilar furgoneta camper sevilla, campers sevilla |
| `/alquiler-autocaravana-fin-de-semana-sevilla/` | alquiler autocaravana fin de semana sevilla |
| `/alquiler-autocaravana-puente-sevilla/` | alquiler autocaravana puente diciembre / semana santa / rocío |
| `/ofertas-alquiler-autocaravana-sevilla/` | alquiler autocaravanas baratas sevilla, ofertas |
| `/calendario-disponibilidad/` | disponibilidad autocaravana sevilla |
| `/rutas/…` | ruta autocaravana costa de cádiz / huelva / algarve desde sevilla |
| `/preguntas-frecuentes/` | dudas long-tail (carnet, mascotas, depósitos…) + FAQ rich results |

Se conservan las URLs que ya tenían autoridad (vehículos, tarifas, FAQ, contacto, requisitos) y las antiguas redirigen con 301.

**Técnico incluido:** HTML estático (Core Web Vitals excelentes), imágenes WebP responsivas, títulos y descripciones únicos, canonical, Open Graph, sitemap XML, robots.txt, migas de pan, Schema `AutoRental`, `Product`/`AggregateOffer`, `FAQPage`, `BreadcrumbList` y `Article`.

**Conversión:** barra fija móvil (Llamar · WhatsApp · Fechas), botón flotante de WhatsApp, formulario con **precio estimado en tiempo real**, calendario donde el cliente selecciona sus fechas y pasa directo a pedir precio, CTAs en cada sección.

**Próximos pasos recomendados (fuera de la web):**
1. Google Business Profile: categoría principal "Servicio de alquiler de autocaravanas", fotos reales cada semana, publicar ofertas y **pedir reseña a cada cliente** al devolver el vehículo (es el factor nº 1 del mapa local).
2. Alta en Search Console de la nueva web + enviar `sitemap-index.xml`.
3. Citas NAP coherentes: Yescapa/Goboony (como escaparate), Páginas Amarillas, Cylex, foros autocaravanistas, Park4night.
4. Publicar 1-2 rutas nuevas al mes (pueblos blancos, Granada/Sierra Nevada, Extremadura).
5. Medición: añadir Google Analytics 4 (eventos `lead_whatsapp` y `lead_form` ya preparados en `dataLayer`) con banner de cookies.
