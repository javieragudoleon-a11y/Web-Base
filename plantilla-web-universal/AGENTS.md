# AGENTS.md - instrucciones operativas obligatorias

Proyecto: web corporativa multi-pagina, HTML/CSS/JavaScript vanilla, compilacion Node sin dependencias, Cloudflare Pages. No React, no Supabase, no frameworks, no nuevas dependencias salvo decision justificada y aprobada.

## Contexto minimo para cada tarea
1. Lee este archivo.
2. Lee `docs/STATUS.md` y `docs/TASK.md`.
3. Lee SOLO los archivos necesarios para la tarea, no todo el repositorio.
4. Consulta `docs/PROJECT.md` o `docs/WORKFLOW.md` solo cuando afecten a la decision.

## Fuente de verdad
- `config/site.json`: datos del cliente, contacto, tema, modulos, SEO local y publicacion.
- `config/themes.json`: cuatro temas reutilizables. Consultar docs/CONFIGURACION.md.
- `config/pages.json`: paginas, rutas y metadatos SEO.
- `src/pages/`: contenidos por pagina, HTML semantico.
- `src/partials/`: header/footer comunes (ensamblados al compilar).
- `src/assets/css/styles.css`: tokens y diseno global.
- `src/assets/js/site.js`: interactividad del navegador.
- `functions/api/`: backend opcional. Claves SOLO en secretos Cloudflare.
- `dist/`: GENERADO. Nunca editar directamente.

## Reglas duras
- Una tarea = un objetivo concreto y unos archivos autorizados.
- No refactorizar, renombrar ni reescribir partes no relacionadas.
- Antes de cambios amplios, explicar una propuesta breve y esperar aprobacion.
- Conservar SEO, accesibilidad, seguridad, responsive y rutas existentes.
- No inventar datos, testimonios, fotos, precios, reseñas, ubicaciones o logros del cliente.
- No exponer secretos ni subir `.dev.vars`/`.env` a Git.
- Ningun formulario se declara funcional hasta probar un envio real y una recepcion real.
- No activar `readyForIndexing` hasta completar contenidos, legales, dominio, QA y visto bueno.
- Si falta informacion esencial, usar TODO claramente visible en fuente y detener publicacion.
- No afirmar que una prueba se ha ejecutado si no se ha ejecutado.

## Dirección visual
- Para trabajos visuales consulta `docs/DIRECCION_VISUAL.md`. Los cuatro temas son puntos de partida, no diseños finales intercambiables.
- Evita tarjetas repetidas, bordes redondeados sistemáticos, textos genéricos, fotografías ficticias, animaciones que bloqueen contenido y efectos gratuitos.
- Adapta portada, jerarquía, secuencia, tipografía y recursos reales al negocio. Respeta movimiento reducido y la funcionalidad sin JavaScript.

## Secuencia de cada tarea
1. Analizar la peticion; identificar archivos minimos.
2. Plan maximo 5 lineas SOLO si el cambio no es trivial.
3. Aplicar cambios localizados. No volver a generar toda la web.
4. Ejecutar `npm run build && npm run check && npm test`.
5. Si cambia UI, comprobar al menos movil y escritorio.
6. Actualizar `docs/STATUS.md` con resultado y siguiente tarea.
7. Responder en 4 lineas: hecho / archivos / pruebas / pendiente.

## Ahorro de contexto
- No volcar archivos completos en la respuesta; entregar resumen y rutas.
- No volver a analizar arquitectura aprobada salvo conflicto real.
- Si se cambia de IA, basta este archivo + STATUS + TASK + archivos relevantes.
- Unicamente pedir informacion al usuario cuando afecte a seguridad, funcionalidad o contenido real.
