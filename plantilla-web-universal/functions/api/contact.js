const reply = (status, message, ok = false) => new Response(JSON.stringify({ok, message}), {
  status,
  headers: {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store'}
});
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const tidy = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';

export async function onRequestPost({request, env}) {
  if (env.CONTACT_ENABLED !== 'true' || !env.RESEND_API_KEY || !env.CONTACT_TO || !env.MAIL_FROM || !env.TURNSTILE_SECRET_KEY) {
    return reply(503, 'Formulario no configurado. Utiliza el telefono de contacto.');
  }
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return reply(403, 'Origen no permitido.');
  if (!(request.headers.get('Content-Type') || '').startsWith('application/json')) {
    return reply(415, 'Formato de solicitud no valido.');
  }
  const size = Number(request.headers.get('Content-Length') || 0);
  if (size > 8000) return reply(413, 'Solicitud demasiado grande.');
  let data;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply(400, 'Solicitud no valida.');
    const decoder = new TextDecoder('utf-8', {fatal:true});
    let raw = '', count = 0;
    while (true) {
      const {done,value} = await reader.read();
      if (done) break;
      count += value.byteLength;
      if (count > 8000) { await reader.cancel(); return reply(413, 'Solicitud demasiado grande.'); }
      raw += decoder.decode(value,{stream:true});
    }
    raw += decoder.decode();
    data = JSON.parse(raw);
  } catch { return reply(400, 'Solicitud no valida.'); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return reply(400, 'Solicitud no valida.');
  if (tidy(data.website, 100)) return reply(200, 'Solicitud recibida.', true);
  const name = tidy(data.name, 100);
  const email = tidy(data.email, 200);
  const phone = tidy(data.phone, 30);
  const service = tidy(data.service, 100);
  const message = tidy(data.message, 2000);
  const token = tidy(data.turnstileToken, 2048);
  if (name.length < 2 || !isEmail(email) || message.length < 10 || data.privacy !== 'accepted') {
    return reply(400, 'Comprueba los campos obligatorios y la privacidad.');
  }
  if (!token) return reply(400, 'Completa la proteccion antispam.');
  try {
    const cfForm = new FormData();
    cfForm.set('secret', env.TURNSTILE_SECRET_KEY);
    cfForm.set('response', token);
    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', body: cfForm, signal: AbortSignal.timeout(10000)
    });
    if (!verification.ok) return reply(503, 'No se pudo verificar la solicitud.');
    const verified = await verification.json();
    const host = new URL(request.url).hostname;
    if (!verified.success || verified.hostname !== host) {
      return reply(400, 'Validacion antispam incorrecta.');
    }

    const emailResult = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {'Authorization': `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({
        from: env.MAIL_FROM, to: [env.CONTACT_TO], reply_to: email,
        subject: 'Nueva solicitud desde la web',
        text: `Nombre: ${name}\nEmail: ${email}\nTelefono: ${phone}\nServicio: ${service}\n\nMensaje:\n${message}\n\nConsentimiento: aceptado en formulario.`
      }),
      signal: AbortSignal.timeout(10000)
    });
    if (!emailResult.ok) return reply(502, 'No se pudo enviar. Intentalo mas tarde.');
    return reply(200, 'Solicitud recibida.', true);
  } catch {
    return reply(503, 'Servicio temporalmente no disponible. Intentalo mas tarde.');
  }
}
