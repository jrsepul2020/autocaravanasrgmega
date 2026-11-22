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
| **Tarifas** por tramos de días, tarifas especiales y condiciones | **Google Sheets** (ver abajo). Valores de respaldo: `src/data/rates.ts` |
| Ofertas del banner | **Google Sheets**. Respaldo: `src/data/site.ts` → `offers` |
| Preguntas frecuentes | `src/data/faqs.ts` |
| Rutas | `src/data/rutas.ts` |

### Tarifas, ofertas y condiciones (Google Sheets)
Se gestionan desde una hoja de Google, **sin tocar código ni volver a subir la web**. La primera pestaña de la hoja, **CÓMO USAR**, lo explica todo.

Hoja: https://docs.google.com/spreadsheets/d/15ci4BIAbpV3NxUKtrd-QioHKiVRa55dwzitK-7Ho0TY/edit
(compartida como *Cualquier persona con el enlace → Lector*; el ID está en `src/data/sheet.ts` → `sheetId`).

**Pestañas**
- **Tarifas**: una fila por vehículo y periodo (Periodo, Desde, Hasta, Vehículo y el precio por día de 2 días, 3–4 días, 5–6 días y 7 días o más). Para cambiar de tarifas, añade un periodo nuevo con sus fechas. El "desde" de la web es el precio de 3–4 días.
- **Tarifas especiales**: precio total cerrado. Con fechas (puentes, Navidad, Fin de Año) se aplica si el cliente elige justo esas fechas y esos días salen marcados en el calendario; sin fechas (escapadas de fin de semana) sale como ejemplo de precio. `Mostrar` = SI/NO.
- **Condiciones**: kilómetros, exceso, mínimo, fianza… El texto de la columna B sale tal cual en la web (tarifas, calculadora, datos clave, condiciones).
- **Ofertas**: una fila por banner (portada y página de Ofertas). `SI` para mostrarla; caducan solas al pasar "Válida hasta". **Precio antes €/día (opcional)** sale tachado con el sello de % de descuento; si está vacío, se compara con el precio "desde" del vehículo. El sello solo aparece con un descuento del 5 % o más. Por ley, el "precio antes" debe ser el más bajo aplicado en los 30 días previos.
- **Ajustes**: **Mostrar precios desde** (SI/NO). Con `NO` se ocultan los "Alquiler desde X €/día" de las fichas (en vivo) y, al volver a publicar, la pregunta "¿Cuánto cuesta…?" y el dato "Precio" de los datos clave pasan a texto sin cifras.
- Las pestañas **ANTIGUO …** ya no se usan; puedes borrarlas.

**Cómo calcula la web**
- Los días se cuentan por noches: viernes a domingo = 2 días.
- Precio = precio por día del tramo × días, según el periodo en el que empieza el alquiler. Si las fechas coinciden justo con una tarifa especial, se usa su precio cerrado; si solo se solapan, se avisa de que hay tarifa especial.
- Si la fecha no está en ningún periodo, la web no calcula precio y pide que os consulten.
- Con 1 noche la web no calcula precio: recuerda el mínimo de 3 días y pide que llamen.
- Todos los precios se muestran como orientativos, invitando a llamar o preguntar por fechas o casos concretos.
- Al pulsar "Pedir esta reserva" o "Consultar estas fechas" en el calendario se abre una ventana de consulta con las fechas y el precio ya puestos.

**Dónde salen precios**: Tarifas (tablas y tarifas especiales), fichas de cada vehículo (caja de precio y tabla), calendario (precio por día y resumen) y ofertas. Se actualizan en vivo (unos 5 minutos). Los títulos y descripciones de Google no llevan precios a propósito.

**Para Google (SEO)**: la FAQ de precio, los datos clave, `llms.txt` y los datos estructurados se escriben con la hoja **al compilar**. Cuando cambies las tarifas, vuelve a publicar la web (subir a GitHub y `dist/` a Nominalia) para que Google vea los nuevos precios.

Si la hoja no responde, la web usa las tarifas guardadas en `src/data/rates.ts`.

`admin/plantilla-precios-rgmega.xlsx` es la plantilla antigua (por temporadas) y ya no sirve.

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
