import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.avif':'image/avif'};
http.createServer(async (req,res) => {
  try {
    let pathname = new URL(req.url,'http://localhost').pathname;
    if (pathname.startsWith('/api/')) {res.writeHead(501);res.end('API solo disponible en Cloudflare Pages Functions.');return;}
    const filepath = path.resolve(root, '.' + decodeURIComponent(pathname));
    if (filepath!==root && !filepath.startsWith(root+path.sep)) {res.writeHead(403);res.end();return;}
    let candidate = filepath;
    const info = await stat(candidate).catch(()=>null);
    if (info?.isDirectory()) candidate = path.join(candidate,'index.html');
    const body = await readFile(candidate);
    res.writeHead(200,{'Content-Type':mime[path.extname(candidate)] || 'application/octet-stream'});
    res.end(body);
  } catch {res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(path.join(root,'404.html')).catch(()=> 'Pagina no encontrada'));}
}).listen(4173,'127.0.0.1',()=> console.log('Previsualizacion: http://127.0.0.1:4173'));
