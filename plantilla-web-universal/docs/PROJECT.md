# Proyecto de referencia - plantilla universal

**Producto:** web corporativa SEO-first para pymes y autonomos. Estructura universal para negocios de servicios y empresas locales.

**Arquitectura:** HTML semantico prerenderizado en build, CSS con variables, JavaScript vanilla para interaccion, Node solo para ensamblar paginas. Cloudflare Pages aloja el resultado `dist/`. Cloudflare Pages Functions se usa solo si hay backend. Sin React, SPA, Supabase, CMS o base de datos por defecto.

**Rutas base:** /, /servicios/, /nosotros/, /contacto/, /privacidad/, /aviso-legal/. Paginas especificas opcionales via `config/pages.json` y `src/pages/*.html`.

**Temas y módulos:** cuatro estilos reutilizables, galería, WhatsApp y formulario opcionales; SEO local JSON-LD.

**Componentes:** header y footer compartidos a nivel build; botones, cards, hero y formularios mediante clases CSS estables.

**Objetivo comercial:** explicar propuesta de valor, generar confianza y convertir visitas en contactos. Priorizar la claridad sobre animaciones y dependencias.

**SEO:** cada pagina debe tener h1, title y descripcion propios, URLs limpias, enlaces internos, contenido en HTML y canonical cuando haya dominio confirmado. Sitemap solo en publicacion. No crear paginas locales duplicadas ni prometer ranking.

**Seguridad y legal:** secrets en Cloudflare; Turnstile validado en backend; privacidad revisada; formulario desactivado hasta configuracion. Cookies/analitica no incluidas por defecto.

**No objetivos v2:** e-commerce, pagos, cuentas, reservas confirmadas, CMS, multiidioma, CRM, dashboards.
