import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = new URL('../../dist', import.meta.url).pathname; // run `npm run build` at the repo root first
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.svg':'image/svg+xml','.avif':'image/avif','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.pdf':'application/pdf','.json':'application/json','.webmanifest':'application/manifest+json','.txt':'text/plain','.xml':'application/xml'};
http.createServer((req,res)=>{
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.startsWith('/api/')) { res.writeHead(404); return res.end(); }
  let f = path.join(root,p);
  const cands = [f, f+'.html', path.join(f,'index.html')];
  let hit = cands.find(c=>fs.existsSync(c)&&fs.statSync(c).isFile()) || path.join(root,'index.html');
  res.writeHead(200,{'content-type':types[path.extname(hit)]||'application/octet-stream'});
  fs.createReadStream(hit).pipe(res);
}).listen(4173,()=>console.log('up'));
