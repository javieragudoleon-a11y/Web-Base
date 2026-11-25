# Publicación en Cloudflare Pages

## Previsualizar sin pagar infraestructura

1. Crea repositorio privado Git para el cliente (GitHub o GitLab). No incluyas secretos ni documentación interna con datos innecesarios. Usa `.gitignore`.
2. En la cuenta Cloudflare del cliente (o con acceso delegado), crea un proyecto Pages conectado a ese repositorio.
3. Selecciona la rama de producción `main`. Configuración: comando `npm run build:cloudflare`, directorio de salida `dist`, raíz del proyecto la carpeta que contiene package.json, versión Node.js 22 (variable NODE_VERSION si es necesaria). Si usas otra rama de producción, configura `PRODUCTION_BRANCH` con el mismo nombre en Cloudflare. El script usa `CF_PAGES_BRANCH`.
4. Trabaja en una rama de pruebas. Las previsualizaciones generadas por el script tendrán noindex y no sitemap. Para material no público, restringe acceso a la vista previa con Cloudflare Access u otro método verificado; noindex NO restringe el acceso. No publiques contenidos sensibles en una URL pública.
5. Antes de fusionar con producción, completa QA y ejecuta `npm run build:production && npm run check && npm test`. La compilación bloqueará la demo si falta aprobación o hay marcadores conocidos. En una web existente conserva las rutas o prepara redirecciones 301 revisadas.
6. Configura el dominio en Custom domains de Pages siguiendo las instrucciones de DNS. No cambies registros MX ni otros servicios del cliente. Confirma HTTPS, redirección al dominio canónico y comportamiento de pages.dev; si procede redirige o restringe el dominio alternativo. Mantén el dominio a nombre del cliente.

## Sin formulario (recomendado para la primera web)

`contactEnabled: false`. Configura teléfono, email y/o WhatsApp. No necesitas secretos, Resend ni Turnstile. La ruta API queda excluida de Pages Functions. No hay correo saliente ni base de datos.

## Con formulario

1. El cliente crea cuenta de Resend y verifica dominio de envío (DNS). Crea un widget Turnstile autorizado para el hostname real.
2. En site.json completa `contactEmail`, `turnstileSiteKey` pública y `contactEnabled: true`.
3. En ajustes de Variables y secretos de Pages, entorno de producción: `CONTACT_ENABLED=true`, `RESEND_API_KEY` (secreto), `TURNSTILE_SECRET_KEY` (secreto), `CONTACT_TO` (correo real destinatario), `MAIL_FROM` (remitente verificado). No los subas a Git. Deja `CONTACT_ENABLED=false` en preview salvo pruebas controladas con buzón y claves separados.
4. Vuelve a desplegar. Prueba un envío desde el dominio final y confirma recepción en el buzón; prueba validaciones, antispam y errores. Los tests locales simulan los proveedores: no acreditan que el correo real llegue.
5. Revisa privacidad, tratamiento de datos, proveedores, límites de consumo y posibles tarifas. Si el cliente desactiva el formulario, desactiva también CONTACT_ENABLED y retira/rota secretos innecesarios.

## Después de publicar

- Verifica dominio, 404, navegación móvil y escritorio, contacto, canonical, robots, sitemap, cabeceras y página de privacidad.
- Verifica Search Console y envía sitemap. Ejecuta PageSpeed Insights sobre la URL final.
- Conserva commit publicado y copia del repo. Para restaurar: volver a un despliegue anterior válido o revertir cambios mediante Git y desplegar. No vuelvas a una versión que reintroduzca secretos o fallos legales.

El ZIP no incluye cuentas, dominio ni despliegue ejecutado. Los menús de Cloudflare pueden cambiar. Para cambios de interfaz consulta https://developers.cloudflare.com/pages/ . Si cargas solo dist por arrastrar y soltar, no presupongas que se despliegan Functions: para esta arquitectura usa integración Git o un procedimiento Wrangler comprobado.
