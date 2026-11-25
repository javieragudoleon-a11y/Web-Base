# LEOVEX | Plantilla maestra web universal v4.0

Base reutilizable para webs corporativas HTML/CSS/JavaScript, compilador Node.js sin dependencias npm y Cloudflare Pages con formulario opcional. No es un CMS, tienda online ni motor de reservas. La copia original v1 no se modifica.

## 1. Empezar (también con Claude Code)

1. Instala Node.js 20 o superior y, para publicar desde repositorio, Git. Descomprime este ZIP y guarda una copia maestra intacta.
2. Duplica la carpeta por cliente. Abre esa copia en Claude Code; nunca autorices cambios en la maestra.
3. Rellena `docs/BRIEF_CLIENTE.md`. Pega `PROMPT_INICIAL.txt` en Claude. Mantén `readyForIndexing: false` durante el trabajo.
4. Desde la carpeta del proyecto (Claude puede ejecutar los comandos):

```sh
npm run qa
npm run dev
```

Abre http://127.0.0.1:4173. Para detener el servidor, Ctrl+C. No hace falta `npm install`. El servidor local no ejecuta Pages Functions.

## 2. Configuración y personalización

- `config/site.json`: datos de negocio, contacto, tema, logo, módulos, SEO local y autorización de indexación.
- `config/themes.json`: cuatro sistemas visuales; elige `elegante`, `industrial`, `corporativo` o `tecnologico` en `theme`. Puedes sobrescribir colores HEX en `brand.colors` (ej. `{"brand":"#153A64"}`). No uses las paletas como sustituto de una revisión de contraste.
- `config/pages.json`: páginas, navegación, títulos y descripciones únicos. Mantén contacto, privacidad y aviso legal. Los contenidos específicos se editan en `src/pages/`.
- `src/assets/img/`: imágenes propias/licenciadas. Usa rutas `/assets/img/nombre.webp`. El logo y la imagen social se configuran en `site.json`.
- `docs/CONFIGURACION.md`: todos los campos y ejemplos. `docs/PUBLICACION_CLOUDFLARE.md`: publicación paso a paso. `docs/ENTREGA_MANTENIMIENTO.md`: transferencia, servicio y restauración.

## 3. Seguridad y publicación

`npm run build` genera `dist/`. `npm run build:production` exige datos reales, textos legales revisados y autorización explícita de indexación. El control detecta marcadores comunes, no sustituye la revisión humana. `npm run build:cloudflare` distingue rama de producción y previsualizaciones. No publiques manualmente `dist/` si no has validado una compilación de producción.

Por defecto, todo está en modo demo sin sitemap ni indexación, y los módulos están desactivados. **Noindex no es una contraseña**: usa acceso privado para prototipos confidenciales. No actives el formulario sin probar envío real y recepción en el correo del cliente.

## 4. Comprobaciones

`npm run qa`: genera, verifica y ejecuta las pruebas automáticas. Incluye cuatro temas, módulos, controles de producción, SEO y backend de contacto con servicios externos simulados. Completa `docs/QA.md` para cada cliente. No se garantiza posicionamiento ni cumplimiento legal por pasar las pruebas.

## V4: dirección visual editorial
Cuatro composiciones, tipografías, navegación, módulos de servicios y ritmos distintos. Sin tarjetas redondeadas por defecto. Animaciones ligeras de entrada, desplazamiento y microinteracciones, sin bibliotecas externas. `design.motion: false` las desactiva; se respeta también `prefers-reduced-motion`.

Configura `design.heroImage` con una imagen real del cliente, `design.heroAlt`, `design.heroCaption` y `design.heroPosition`. Las cuatro ilustraciones vectoriales incluidas son demos, no fotografías reales; la publicación requiere sustituirlas si se utiliza la portada estándar. Consulta `docs/DIRECCION_VISUAL.md` antes de adaptar una web a un cliente. Los cambios se ven tras detener y volver a iniciar `npm.cmd run dev` en Windows.
