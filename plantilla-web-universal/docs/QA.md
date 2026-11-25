# Checklist de entrega - obligatorio

## Contenido
- [ ] Nombre, servicios, ubicacion y telefono reales.
- [ ] Sin frases demo, testimonios falsos, fotos sin licencia ni cifras inventadas.
- [ ] Contactos y CTA correctos; todos los enlaces funcionan.

## SEO
- [ ] Title, meta description y H1 unicos y relevantes por URL.
- [ ] Contenido importante en HTML, enlaces internos rastreables, canonical correcto.
- [ ] Sitemap solo con paginas publicables; robots y noindex revisados.
- [ ] Imagenes con dimensiones, alt relevante y peso razonable.
- [ ] Search Console verificado tras publicacion.

## UX / diseno
- [ ] Sin scroll horizontal ni elementos cortados en 360/390/768/1440 px.
- [ ] Menu movil, botones y enlaces funcionan en teclado y tactil.
- [ ] Contraste legible, labels, foco visible, jerarquia de titulos.
- [ ] Fuentes y fotografias adecuadas; comportamiento con JS desactivado razonable.

## Formulario (si lo hay)
- [ ] Envios validos llegan a la bandeja real.
- [ ] Envios invalidos rechazados en backend.
- [ ] Turnstile verificado en servidor; secretos no incluidos en el repo.
- [ ] Error de correo no muestra exito.
- [ ] Pruebas con spam, duplicados, fallo de red y estado loading.
- [ ] Privacidad informa de fines y destinatarios del tratamiento.

## Rendimiento y seguridad
- [ ] Revisar Core Web Vitals en movil; corregir problemas relevantes.
- [ ] HTTPS, cabeceras, dependencias, permisos y dominio controlado por cliente.
- [ ] Backup/repositorio privado y posibilidad de restaurar.

## Legal y publicacion
- [ ] Aviso legal y privacidad revisados; cookies/analitica gestionadas cuando proceda.
- [ ] Dominio del cliente y correo verificados.
- [ ] Cliente aprueba contenidos y condiciones de servicio.
- [ ] `readyForIndexing` habilitado solo tras comprobaciones; `contactEnabled` solo si se contrata formulario.
- [ ] `npm run build:production && npm run check && npm test` superado.
- [ ] Preview privada si procede; noindex no es control de acceso.
- [ ] Datos estructurados y Open Graph verificados cuando corresponda.
- [ ] Titular recibe copia, accesos y condiciones de mantenimiento opcional.
