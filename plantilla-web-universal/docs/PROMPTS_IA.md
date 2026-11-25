# Prompts para IA con consumo controlado

## A. Primer mensaje al agente (una sola vez)
"Trabaja en este repositorio. Lee AGENTS.md, docs/PROJECT.md, docs/STATUS.md y docs/TASK.md. No programes hasta identificar la tarea. Respeta HTML/CSS/JS vanilla, componentes compartidos y Cloudflare Pages. Cambia solo archivos necesarios, prueba, y resume resultado en cuatro lineas. No reproduzcas archivos completos ni vuelvas a explicar la arquitectura."

## B. Para CADA tarea posterior
"Ejecuta docs/TASK.md. Lee AGENTS.md, docs/STATUS.md y solo archivos afectados. Haz cambio minimo y pruebas. Actualiza STATUS. Salida: hecho / archivos / pruebas / pendiente."

## C. Nuevo cliente (planificacion, sin programar)
"Con docs/BRIEF_CLIENTE.md define el mapa de paginas y objetivo SEO/comercial por URL. Usa la arquitectura actual, no inventes datos y no programes aun. Devuelve propuesta corta para aprobar."

## D. Desarrollar una pagina
"Implementa solo [PAGINA] segun brief y mapa aprobado. Modifica unicamente [ARCHIVOS]. Reutiliza estilos; no toques otras paginas. Comprueba build y responsive."

## E. Solucionar error
"Reproduce el error [DESCRIPCION]. Identifica causa raiz, corrige el cambio minimo, ejecuta pruebas y explica evidencia. No refactorices lo no relacionado."

## F. Handoff de IA
"Continua el proyecto desde AGENTS.md + STATUS.md + TASK.md. No necesitas historial de chat. Indica si existe algun bloqueo antes de modificar codigo."

## G. Cerrar sesion
"Actualiza STATUS con lo hecho, archivos y siguiente tarea. Responde con un resumen de maximo cuatro lineas; no repitas codigo completo."

**Regla:** no pegar 20 archivos completos en el chat. Dar al agente acceso al repositorio y rutas concretas. Contexto reducido no significa omitir pruebas o seguridad.
