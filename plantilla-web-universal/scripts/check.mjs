import {readFile,access} from 'node:fs/promises';
import path from 'node:path';
const read=p=>readFile(p,'utf8');
const pages=JSON.parse(await read('config/pages.json'));
const site=JSON.parse(await read('config/site.json'));
const info=JSON.parse(await read('dist/.build-info.json'));
const errors=[], slugs=new Set(pages.map(p=>'/'+(p.slug?p.slug+'/':''))), titles=new Set(), descriptions=new Set();
const fail=m=>errors.push(m);
for(const p of [...pages,{slug:'404',noindex:true}]){
 const name=p.slug||'inicio', html=await read(p.slug==='404'?'dist/404.html':path.join('dist',p.slug,'index.html'));
 if((html.match(/<h1(?:\s|>)/gi)||[]).length!==1) fail(`${name}: debe tener 1 H1`);
 const title=html.match(/<title>([^<]+)<\/title>/)?.[1], description=html.match(/<meta name="description" content="([^"]+)"/)?.[1];
 if(!title||titles.has(title)) fail(`${name}: title vacio o duplicado`);titles.add(title);
 if(!description||descriptions.has(description)) fail(`${name}: descripcion vacia o duplicada`);descriptions.add(description);
 if(/\{\{[A-Z_]+\}\}/.test(html)) fail(`${name}: placeholder sin resolver`);
 const robots=info.indexing&&!p.noindex?'index,follow':'noindex,follow';
 if(!html.includes(`name="robots" content="${robots}"`)) fail(`${name}: robots incorrecto`);
 if(!html.includes('id="contenido"')||!html.includes('class="skip-link"')) fail(`${name}: falta accesibilidad basica`);
 if(info.indexing&&p.slug!=='404'&&!html.includes('rel="canonical"')) fail(`${name}: falta canonical`);
 for(const [,href] of html.matchAll(/href="(\/[^"?#]*)"/g)){
  if(href.startsWith('/assets/')||href==='/favicon.svg'){try{await access(path.join('dist',href));}catch{fail(`${name}: recurso no encontrado ${href}`);}}
  else if(!slugs.has(href)) fail(`${name}: enlace interno desconocido ${href}`);
 }
 for(const [,src] of html.matchAll(/src="(\/assets\/[^"?#]+)"/g)){try{await access(path.join('dist',src));}catch{fail(`${name}: recurso inexistente ${src}`);}}
 for(const [img] of html.matchAll(/<img\b[^>]*>/gi)) if(!/\balt="[^"]*"/.test(img)) fail(`${name}: imagen sin alt`);
 if(p.slug==='contacto'&&html.includes('id="lead-form"')!==info.formEnabled) fail('Formulario no coincide con configuracion');
 if(!info.formEnabled&&html.includes('challenges.cloudflare.com')) fail(`${name}: carga Turnstile sin formulario`);
 if(p.slug===''&&info.indexing){try{const data=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);if(data.name!==site.businessName)fail('Schema: nombre incorrecto');}catch{fail('Schema ausente o invalido');}}
}
for(const f of ['dist/assets/css/styles.css','dist/assets/css/theme.css','dist/assets/js/site.js','dist/favicon.svg','dist/_routes.json','dist/404.html']){try{await access(f);}catch{fail(`Falta ${f}`);}}
const sitemap=await read('dist/sitemap.xml').catch(()=>null);
if(info.indexing){if(!sitemap)fail('Falta sitemap');else for(const p of pages){const url=(site.siteUrl.replace(/\/+$/,'')+'/'+(p.slug?p.slug+'/':'' )).replace(/&/g,'&amp;');if(sitemap.includes(`<loc>${url}</loc>`)===!!p.noindex)fail(`Sitemap incorrecto: ${p.slug}`);}}
else if(sitemap)fail('Sitemap presente en vista previa');
const headers=await read('dist/_headers');if(!info.indexing&&!headers.includes('X-Robots-Tag: noindex'))fail('Falta cabecera noindex');
const routes=JSON.parse(await read('dist/_routes.json'));if(info.formEnabled? !routes.include.includes('/api/contact'):!routes.exclude.includes('/*'))fail('Rutas API incoherentes');
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`OK: ${pages.length} paginas + 404, SEO, enlaces y recursos, modulos, sitemap y controles de indexacion.`);
