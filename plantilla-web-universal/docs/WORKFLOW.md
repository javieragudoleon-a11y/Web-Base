# Flujo de trabajo para cualquier nuevo cliente

Regla: completar una fase, verificar y registrar el cierre en STATUS antes de pasar a la siguiente. No programar todo de una vez.

## Fase 0 - Duplicar plantilla
- Crear repositorio privado nuevo para cada cliente. No mezclar datos de clientes.
- Copiar la plantilla; conservar origen para mejoras futuras.
- Rellenar `docs/BRIEF_CLIENTE.md` y ajustar `config/site.json` (mantener `readyForIndexing:false`).
- No empezar codigo con el briefing incompleto.

## Fase 1 - Objetivos y mapa de paginas
- Definir publico, diferenciacion, conversion principal (llamar, Whatsapp, formulario, visita), competencia real y prueba social disponible.
- Crear mapa de paginas en `config/pages.json`; 4-6 paginas por defecto. Solo paginas de servicio especificas cuando haya contenido diferenciado y demanda.
- Salida: sitemap de contenidos y objetivo de cada pagina. Aprobar antes de desarrollar.

## Fase 2 - SEO y contenido
- Para cada pagina: intencion de busqueda, titulo, meta description, H1, secciones H2, CTA, enlaces internos, evidencia y FAQ si procede.
- Generar borrador con IA; validar afirmaciones con el negocio. Nada de testimonios ficticios.
- Salida: contenido aprobado en `src/pages/*.html`.

## Fase 3 - Diseno base
- Elegir paleta, tipografia, espaciados, imagenes con derechos y estilo de fotos; documentar en BRIEF.
- Definir desktop y movil para inicio y pagina de servicio. Revisar antes de expandir.
- Elegir tema en config/site.json y personalizar colores/logotipo. Adaptar header, hero y cards si hace falta; no anadir librerias sin necesidad.

## Fase 4 - Construccion por paginas
- Construir primero Inicio. Verificar escritorio, 390px y 768px.
- Construir Servicios; usar estructura compartida, contenido diferente.
- Construir Nosotros y Contacto. Asegurar enlaces, CTA y navegacion.
- Realizar un commit Git por fase.

## Fase 5 - Funcionalidad opcional
- Nivel 0: botones de llamada, email o Whatsapp; sin servidor.
- Nivel 1: formulario enviado por Pages Functions + Resend + Turnstile.
- Nivel 2: solicitud de disponibilidad: formulario con fecha y datos; NO implica confirmacion automatica.
- Nivel 3: reservas reales: proyecto independiente, requiere BD, concurrencia, backoffice y pruebas adicionales.
- Nunca habilitar el formulario hasta configurar secrets y probar recepcion y errores.

## Fase 6 - QA
- `npm run build && npm run check && npm test`.
- Revisar 360px, 390px, 768px, 1440px; teclado; lectores basicos; formularios y enlaces.
- Revisar PageSpeed y Search Console en produccion cuando corresponda.
- Comparar `docs/QA.md`. Corregir fallos antes de publicar.

## Fase 7 - Publicacion
- Completar `src/pages/privacidad.html` y `aviso-legal.html` revisados.
- Actualizar nombre/ciudad/contacto/logo/fotos, title y metas de TODAS las paginas.
- Vincular dominio y email del cliente; Turnstile configurado para hostname final; probar desde dominio real.
- Activar `legalReviewed:true` y `readyForIndexing:true` solo tras aprobacion. `contactEnabled:true` es opcional; requiere pruebas reales. Ejecutar npm run build:production. Ver docs/PUBLICACION_CLOUDFLARE.md.
- Generar sitemap y revisar indexacion; enviar sitemap a Search Console.

## Fase 8 - Entrega y mantenimiento
- Transferir dominio/accesos al titular o dar permisos documentados.
- Registrar backups (repositorio privado), cambios, renovaciones y procedimiento de restauracion.
- Completar docs/ENTREGA_MANTENIMIENTO.md con URLs, alcance, acceso delegado y limites del mantenimiento.

## Metodo para ahorrar tokens en cada sesion
1. Copiar un objetivo concreto en TASK (sin historia larga).
2. La IA lee AGENTS + STATUS + TASK y 1-3 archivos involucrados.
3. Hace un cambio pequeno y pruebas; muestra diff resumido.
4. Se actualiza STATUS para la siguiente sesion. No volver a explicar todo.
