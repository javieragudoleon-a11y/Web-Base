import {readFile, writeFile, rm, mkdir, cp, access} from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd(), r = p => path.join(root,p), dist = r('dist');
const read = p => readFile(r(p),'utf8');
const site = JSON.parse(await read('config/site.json'));
const pages = JSON.parse(await read('config/pages.json'));
const themes = JSON.parse(await read('config/themes.json'));
const production = process.argv.includes('--production');
const preview = process.argv.includes('--preview');
const indexing = site.readyForIndexing === true && !preview;
const esc = (s='') => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const fill = (s,v) => s.replace(/\{\{([A-Z_]+)\}\}/g,(m,k)=>Object.hasOwn(v,k)?v[k]:m);
const urlPath = s => s?`/${s}/`:'/';
const fail = m => {throw Error(m)};
const str = v => typeof v==='string'?v.trim():'';
const siteUrl = str(site.siteUrl).replace(/\/+$/,'');
const email = str(site.contactEmail), phone = str(site.contactPhone);
const validEmail = s=>/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(s);
const validPhone = s=>/^\+[1-9]\d{7,14}$/.test(s.replace(/[\s()-]/g,''));
const tel = phone.replace(/[\s()-]/g,'');
const wa = site.modules?.whatsapp || {}, gallery = site.modules?.gallery || {}, seo=site.seo || {};
const formEnabled = site.contactEnabled === true;
const theme = site.theme || 'elegante';
if (!Object.hasOwn(themes,theme)) fail('Tema desconocido');
const colors = {...themes[theme]};
for (const [key,val] of Object.entries(site.brand?.colors || {})) {
  if (!Object.hasOwn(colors,key) || key==='radius' || !/^#[0-9a-f]{6}$/i.test(val)) fail(`Color no valido: ${key}`);
  colors[key]=val;
}
if (!Array.isArray(pages) || !pages.length || new Set(pages.map(p=>p.slug)).size!==pages.length || !pages.some(p=>p.slug==='')) fail('Paginas invalidas');
if(pages.some(p=>p.slug==='404'||typeof p.slug!=='string'||(p.slug!==''&&!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug))||! /^[a-z0-9-]+\.html$/.test(p.source)||!str(p.title)||!str(p.description)||!str(p.label))) fail('Pagina, ruta o SEO invalido');
for(const slug of ['contacto','privacidad','aviso-legal']) if(!pages.some(p=>p.slug===slug)) fail(`Falta pagina obligatoria: ${slug}`);
if(siteUrl&&!/^https:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(siteUrl)) fail('siteUrl debe ser HTTPS sin ruta');
if(email&&!validEmail(email)) fail('Email no valido');
if(phone&&!validPhone(phone)) fail('Telefono no valido: usa prefijo internacional +34');
if(wa.enabled&&!/^[1-9]\d{7,14}$/.test(str(wa.number))) fail('WhatsApp: numero internacional sin + ni espacios');
if(formEnabled&&(!str(site.turnstileSiteKey)||!email)) fail('Formulario: requiere email y clave publica Turnstile');
if(production&&!indexing) fail('Produccion bloqueada: readyForIndexing debe estar activado');
const allowedTypes=['Organization','LocalBusiness','ProfessionalService','HomeAndConstructionBusiness','Electrician','Plumber','Dentist','AutoRepair','Restaurant','LodgingBusiness','Store','FinancialService','RealEstateAgent','HealthAndBeautyBusiness','EventVenue'];
if(!allowedTypes.includes(seo.type||'LocalBusiness')) fail('Tipo Schema.org no admitido');
for(const u of seo.sameAs||[]) {try {if(new URL(u).protocol!=='https:') fail('sameAs exige HTTPS')}catch{fail('URL sameAs invalida')}}
async function asset(p){
  if(!/^\/assets\/img\/[a-zA-Z0-9_./-]+\.(svg|png|jpe?g|webp|avif)$/i.test(p)||p.split('/').includes('..')) fail(`Ruta imagen no valida: ${p}`);
  await access(r('src'+p)); return esc(p);
}
const design=site.design||{};
if(design.motion!==undefined && typeof design.motion!=='boolean') fail('design.motion debe ser booleano');
const heroPosition=design.heroPosition||'center';
if(!['center','top','bottom','left','right'].includes(heroPosition)) fail('Posicion de imagen no valida');
const heroSrc=design.heroImage?await asset(design.heroImage):await asset('/assets/img/editorial-'+theme+'.svg');
if(design.heroImage&&!str(design.heroAlt)) fail('La imagen principal requiere texto alternativo');
const heroAlt=design.heroImage?esc(design.heroAlt):'Ilustración de demostración';
const logo=site.brand?.logo?await asset(site.brand.logo):'';
const share=seo.shareImage?await asset(seo.shareImage):'';
if(share&&/\.svg$/i.test(share)) fail('Imagen social: usa PNG, JPG, WebP o AVIF (preferible JPG/PNG)');
const items=[];
if(gallery.enabled){
  if(!Array.isArray(gallery.items)||!gallery.items.length) fail('Galeria activada sin imagenes');
  for(const item of gallery.items){
    if(!str(item.alt)||!Number.isInteger(item.width)||!Number.isInteger(item.height)||item.width<1||item.height<1) fail('Galeria: alt y dimensiones reales obligatorios');
    items.push(`<figure><img src="${await asset(item.src)}" alt="${esc(item.alt)}" width="${item.width}" height="${item.height}" loading="lazy" decoding="async">${item.caption?`<figcaption>${esc(item.caption)}</figcaption>`:''}</figure>`);
  }
}
const galleryHtml=items.length?`<section class="section section-cream" id="galeria" aria-labelledby="galeria-titulo"><div class="container"><h2 id="galeria-titulo">${esc(gallery.title||'Galería')}</h2><div class="gallery-grid">${items.join('')}</div></div></section>`:'';
const legalSource=(await read('src/pages/privacidad.html'))+' '+(await read('src/pages/aviso-legal.html'));
const demoPattern=/(demostraci[oó]n|personaliza|sustituye|pendiente de revisi[oó]n|texto gen[eé]rico|servicio principal|segundo servicio|empresa de ejemplo|municipio del cliente|\bTODO\b)/i;
if(indexing){
  if(!design.heroImage && (await read('src/pages/inicio.html')).includes('{{HERO_IMAGE}}')) fail('Indexacion bloqueada: sustituye la ilustracion de portada');
  if(!siteUrl||!str(site.businessName)||!str(site.city)||!site.legalReviewed||!(email||phone||wa.enabled)||demoPattern.test(site.businessName+' '+site.city+' '+legalSource)||!str(seo.description)) fail('Indexacion bloqueada: completa dominio, datos, contacto, SEO y textos legales revisados');
  for(const p of pages){const html=await read('src/pages/'+p.source);if(demoPattern.test(html+' '+p.title+' '+p.description)) fail(`Contenido demo en ${p.source}`);}
  if(/(imagen-demostracion|editorial-(elegante|industrial|corporativo|tecnologico)\.svg)/i.test(JSON.stringify({logo,share,gallery,heroImage:design.heroImage}))) fail('Imagen demo en configuracion');
}
const contactLinks=[phone?`<a href="tel:${esc(tel)}">${esc(phone)}</a>`:'',email?`<a href="mailto:${esc(email)}">${esc(email)}</a>`:'',wa.enabled?`<a href="https://wa.me/${esc(wa.number)}?text=${esc(encodeURIComponent(wa.message||''))}" rel="noopener noreferrer">WhatsApp</a>`:''].filter(Boolean);
const contactHtml=contactLinks.length?`<div class="contact-links">${contactLinks.join('')}</div>`:'';
const brandMark=logo?`<img class="brand-logo" src="${logo}" alt="">`:`<span class="brand-mark" aria-hidden="true">${esc(Array.from(str(site.businessName))[0]||'L')}</span>`;
const schema={ '@context':'https://schema.org','@type':seo.type||'LocalBusiness','@id':siteUrl+'/#business',name:site.businessName,url:siteUrl,description:seo.description };
if(phone) schema.telephone=tel;
if(email) schema.email=email;
if(logo) schema.logo=siteUrl+site.brand.logo;
if(share) schema.image=siteUrl+seo.shareImage;
const address=Object.fromEntries(Object.entries(seo.address||{}).filter(([k,v])=>['streetAddress','addressLocality','addressRegion','postalCode','addressCountry'].includes(k)&&str(v)));
if(address.streetAddress&&address.addressLocality&&address.addressCountry) schema.address={'@type':'PostalAddress',...address};
if(seo.areaServed?.length) schema.areaServed=seo.areaServed;
if(seo.sameAs?.length) schema.sameAs=seo.sameAs;
// Do not publish fictional/local address information or review/rating claims.
const jsonLd=indexing?`<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>`:'';
const layout=await read('src/layout.html'), header=await read('src/partials/header.html'), footer=await read('src/partials/footer.html');
const formTpl=await read('src/partials/form.html');
const form=formEnabled?fill(formTpl,{TURNSTILE_WIDGET:`<div class="cf-turnstile" data-sitekey="${esc(site.turnstileSiteKey)}"></div>`}):'';
await rm(dist,{recursive:true,force:true});await mkdir(dist,{recursive:true});
await cp(r('public'),dist,{recursive:true});await cp(r('src/assets'),path.join(dist,'assets'),{recursive:true});
await writeFile(path.join(dist,'assets/css/theme.css'),`:root {\n${Object.entries(colors).map(([k,v])=>`  --${k}: ${v};`).join('\n')}\n}\n`);
const common={HERO_IMAGE:heroSrc,HERO_ALT:heroAlt,HERO_DEMO:design.heroImage?'false':'true',HERO_POSITION:heroPosition,HERO_CAPTION:esc(design.heroCaption||''),MOTION:design.motion===false?'off':'on',BUSINESS_NAME:esc(site.businessName),TAGLINE:esc(site.tagline),CITY:esc(site.city),YEAR:String(new Date().getUTCFullYear()),BRAND_MARK:brandMark,CONTACT_LINKS:contactHtml,CONTACT_NOTE:contactLinks.length?'':(!formEnabled?'<p>Datos de contacto pendientes de configuración.</p>':''),CONTACT_LAYOUT:formEnabled?'contact-layout':'content-narrow',FORM:form,GALLERY:galleryHtml,FOOTER_NOTICE:indexing?'':'Vista previa: no indexar.',CONTACT_ENABLED:String(formEnabled)};
function values(page,content){
 const nav=pages.filter(p=>p.inNav).map(p=>`<a href="${urlPath(p.slug)}"${p.slug===page.slug?' aria-current="page"':''}>${esc(p.label)}</a>`).join('\n');
 const is404=page.slug==='404';
 return {...common,LANG:esc(site.language||'es'),TITLE:esc(page.title),DESCRIPTION:esc(page.description),ROBOTS:indexing&&!page.noindex?'index,follow':'noindex,follow',CANONICAL:siteUrl&&!is404?`<link rel="canonical" href="${esc(siteUrl+urlPath(page.slug))}">`:'',OG_URL:siteUrl&&!is404?`<meta property="og:url" content="${esc(siteUrl+urlPath(page.slug))}">`:'',OG_IMAGE:siteUrl&&share?`<meta property="og:image" content="${esc(siteUrl+seo.shareImage)}">`:'',STRUCTURED_DATA:page.slug===''?jsonLd:'',THEME:theme,THEME_COLOR:colors.brand,TURNSTILE_SCRIPT:page.slug==='contacto'&&formEnabled?'<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>':'',HEADER:fill(header,{...common,NAV:nav}),FOOTER:fill(footer,common),CONTENT:fill(content,common)};
}
for(const page of pages){
 const html=fill(layout,values(page,await read('src/pages/'+page.source)));
 if(/\{\{[A-Z_]+\}\}/.test(html)) fail(`Placeholder sin resolver: ${page.slug}`);
 const dest=path.join(dist,page.slug);await mkdir(dest,{recursive:true});await writeFile(path.join(dest,'index.html'),html);
}
await writeFile(path.join(dist,'404.html'),fill(layout,values({slug:'404',title:'Página no encontrada',description:'La página solicitada no está disponible.',noindex:true},'<section class="section"><div class="container"><h1>Página no encontrada</h1><p>La dirección solicitada no está disponible.</p><a class="btn btn-primary" href="/">Volver al inicio</a></div></section>')));
const enabled=pages.filter(p=>!p.noindex&&indexing);
if(siteUrl&&enabled.length) await writeFile(path.join(dist,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${enabled.map(p=>`<url><loc>${esc(siteUrl+urlPath(p.slug))}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile(path.join(dist,'robots.txt'),`User-agent: *\nAllow: /\n${siteUrl&&enabled.length?`Sitemap: ${siteUrl}/sitemap.xml\n`:''}`);
await writeFile(path.join(dist,'_routes.json'),JSON.stringify({version:1,include:formEnabled?['/api/contact']:['/*'],exclude:formEnabled?[]:['/*']},null,2)+'\n');
if(!indexing) await writeFile(path.join(dist,'_headers'),(await read('public/_headers')).trimEnd()+'\n  X-Robots-Tag: noindex, follow\n');
await writeFile(path.join(dist,'.build-info.json'),JSON.stringify({indexing,formEnabled,theme,preview},null,2));
console.log(`Generadas ${pages.length} paginas + 404. Tema: ${theme}. Indexacion: ${indexing?'ACTIVA':'DESACTIVADA'}. Formulario: ${formEnabled?'ACTIVO EN HTML (requiere secretos)':'DESACTIVADO'}.`);
