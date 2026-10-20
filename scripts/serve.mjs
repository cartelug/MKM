// Optional local preview for the repository owner. No external dependencies.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(fileURLToPath(new URL('../dist',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.woff':'font/woff','.txt':'text/plain; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  const pathname=decodeURIComponent(url.pathname);
  if(pathname.split('/').some(part=>part.startsWith('.')&&part!=='')){res.writeHead(404);res.end('Not found');return;}
  let filename=path.resolve(root,'.'+pathname);
  if(!filename.startsWith(root+path.sep)&&filename!==root){res.writeHead(403);res.end('Forbidden');return;}
  try{if((await stat(filename)).isDirectory()){
   if(!pathname.endsWith('/')){res.writeHead(301,{Location:pathname+'/'+url.search});res.end();return;}
   filename=path.join(filename,'index.html');
  }}catch{filename=path.join(root,'404.html');res.statusCode=404;}
  const data=await readFile(filename);
  res.setHeader('Content-Type',types[path.extname(filename)]??'application/octet-stream');
  res.setHeader('X-Content-Type-Options','nosniff');res.end(data);
 }catch{res.writeHead(400);res.end('Unable to serve this request');}
});
const port=Number(process.env.PORT)||4173;
server.listen(port,'0.0.0.0',()=>console.log(`MKM Beauty local preview: http://localhost:${port}`));
