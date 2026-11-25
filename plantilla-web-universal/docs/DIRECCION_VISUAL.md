# Dirección visual LEOVEX v4

El cliente debe recibir un sitio reconocible y específico para su negocio, no una plantilla coloreada. El sistema conserva SEO, HTML estático, configuración y módulos. La estética es una decisión por proyecto.

## Elegir un punto de partida
- Elegante: composición de revista, portada panorámica, títulos serif grandes, tonos naturales, divisores finos. Para celebraciones: fotografías reales de los espacios, galería editorial y CTA de visita.
- Industrial: portada oscura, titulares contundentes, geometría angular, lista horizontal de servicios, proyectos y materiales reales.
- Corporativo: jerarquía tipográfica, composición asimétrica, servicios con un bloque destacado. Para asesorías: confianza acreditada, especialidades y proceso.
- Tecnológico: cabecera oscura, portada centrada y visual técnico, líneas y retícula discreta. Para software: mostrar producto real, beneficios y demostración.

## Personalización mínima por cliente
1. Define una idea visual a partir de la marca, el sector y el público objetivo. Elige la composición de portada, no solo la paleta.
2. Sustituye el titular genérico por una propuesta real. Ajusta anchos de texto, contraste y ritmo vertical. Usa el logotipo real.
3. Solicita fotografías propias o con licencia. No presentes ilustraciones ni imágenes de stock como instalaciones o proyectos reales. Optimiza peso y recorte. La portada debe tener texto alternativo adecuado.
4. Modifica la secuencia de secciones para contar una historia. Evita repetir tres tarjetas de servicios en todos los sitios. Alterna imagen/texto, índices de servicios, galería editorial y llamada a la acción según necesidades. No inventes testimonios, métricas, años de experiencia ni premios.
5. Usa animaciones breves y discretas: entrada, revelado al desplazarse, subrayado y flechas, zoom sutil. No uses cursores personalizados, scroll secuestrado ni animaciones que oculten contenido de forma permanente. Respeta movimiento reducido.
6. Revisa escritorio y móvil, navegación por teclado, legibilidad, formularios, enlaces y rendimiento antes de publicar.

## Configuración de portada
En `config/site.json`, cambia el objeto `design` y deja los módulos existentes intactos. Ejemplo (ruta ficticia, debes añadir el archivo):

```json
"design": {
  "motion": true,
  "heroImage": "/assets/img/salon.webp",
  "heroAlt": "Salón de celebraciones preparado para una boda",
  "heroCaption": "Salón principal",
  "heroPosition": "center"
}
```

Guarda imágenes dentro de `src/assets/img/`. Si no existe imagen configurada se usa una ilustración de demo distinta por tema. Para una portada personalizada en HTML se deben retirar los marcadores y usar recursos reales, sin sortear el control de publicación. `motion: false` desactiva los efectos animados. No se añaden dependencias de animación ni fuentes remotas.
