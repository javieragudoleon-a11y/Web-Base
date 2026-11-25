# Configuración centralizada de cada cliente

Edita `config/site.json` (JSON válido; sin comentarios ni comas finales). Claude Code puede hacerlo por ti. La configuración no contiene secretos.

| Campo | Uso |
|---|---|
| businessName, tagline, city, language | Nombre, mensaje, localidad y lengua del documento. Los textos de cada página deben adaptarse a dicha lengua. |
| siteUrl | Dominio final HTTPS sin ruta, p. ej. `https://example.org`. |
| theme | elegante / industrial / corporativo / tecnologico. |
| design.motion | true por defecto; false desactiva animaciones. También se respeta la preferencia de movimiento reducido. |
| design.heroImage, heroAlt, heroCaption, heroPosition | Ruta local de imagen de portada, texto alternativo obligatorio si hay imagen, pie opcional y encuadre center/top/bottom/left/right. |
| brand.logo | Ruta local `/assets/img/logo.svg` o imagen raster. Si está vacío aparece la inicial del negocio. |
| brand.colors | Colores HEX de seis dígitos. Claves: brand, brand-dark, accent, bg, cream, text, muted, line. |
| contactEmail, contactPhone | Email real y teléfono con prefijo internacional, p. ej. `+34600000000`. Se muestran en contacto y pie. |
| contactEnabled | true solo para mostrar el formulario; requiere correo y clave pública Turnstile. No obliga a usar formulario en producción. |
| turnstileSiteKey | Clave pública. La privada se configura en Cloudflare. |
| modules.whatsapp | enabled, number (solo dígitos con prefijo internacional), message (texto inicial). |
| modules.gallery | enabled, title, items: src, alt, width, height, caption opcional. Imágenes en src/assets/img/. Aparece en inicio. |
| seo.type | Tipo Schema.org permitido, p. ej. Organization, LocalBusiness, EventVenue, Electrician. Escoge según actividad real. |
| seo.description | Descripción real del negocio, para JSON-LD. Cada página tiene su SEO propio en pages.json. |
| seo.shareImage | Imagen local raster para Open Graph (preferible JPG/PNG, 1200 × 630). |
| seo.address | Dirección pública real. Solo se emite PostalAddress si hay calle, localidad y país. No incluyas un domicilio privado no publicable. |
| seo.areaServed, seo.sameAs | Localidades atendidas y perfiles oficiales HTTPS. No inventes ubicaciones ni reseñas. |
| legalReviewed | true únicamente después de que el titular revise los textos legales. |
| readyForIndexing | true después de completar QA, dominio, contenidos y autorización del titular. |

## Activar WhatsApp y galería (ejemplo ficticio)

Dentro de `modules`:

```json
{
  "whatsapp": {"enabled": true, "number": "34600000000", "message": "Hola, quiero solicitar presupuesto."},
  "gallery": {"enabled": true, "title": "Nuestros espacios", "items": [
    {"src": "/assets/img/salon.webp", "alt": "Salón principal preparado para un evento", "width": 1200, "height": 800, "caption": "Salón principal"}
  ]}
}
```

Sustituye número, fotografía y dimensiones antes de compilar. No hay servicios externos para la galería. WhatsApp abre un enlace externo al pulsarlo; no se carga un widget de seguimiento.

## SEO local por cliente

1. Definir servicios y zona real. Crear páginas de servicios diferenciadas cuando exista contenido útil; no generar decenas de páginas repetidas por localidad.
2. Editar título, descripción, H1 y texto de cada página. Añadir CTA, enlaces, imágenes optimizadas y evidencia autorizada.
3. Completar seo.type, descripción, contacto, dirección pública si aplica, área y perfiles oficiales. El compilador genera JSON-LD en inicio solo cuando se autoriza indexación. Para LocalBusiness con establecimiento, completar dirección real; para negocios sin local público evaluar Organization o la representación adecuada. Validar datos con herramientas de Google y Schema.org; no garantiza resultados enriquecidos.
4. Verificar dominio, sitemap y Search Console tras publicar. Registrar búsquedas, impresiones, clics y contactos si hay medición autorizada.

## Qué NO hace la configuración

No redacta automáticamente textos veraces, políticas legales, ni crea un CMS o una tienda. El cliente debe aprobar textos y fotografías. El SEO inicial no equivale a una campaña de posicionamiento mensual.
