import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createHash, randomBytes} from 'node:crypto';
import {mkdir, readFile, readdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createServer} from 'node:net';
import {createClient} from '@libsql/client';
import ts from 'typescript';
import {defaultCompany, defaultItems} from '../lib/models.ts';

// No production credentials, no live orders, no real payment, storage or SMTP.
const root = process.cwd();
const work = path.join(root, 'work', 'scaling-'+crypto.randomUUID());
await mkdir(work, {recursive:true});
const dbUrl = 'file:'+path.join(work, 'test.db').replaceAll('\\','/');
const db = createClient({url:dbUrl});
for (const name of (await readdir('migrations')).filter(name=>name.endsWith('.sql')).sort()) {
  for (const sql of (await readFile('migrations/'+name,'utf8')).split(';').map(sql=>sql.replace(/--> statement-breakpoint/g,'').trim()).filter(Boolean)) await db.execute(sql);
}
await db.execute({sql:'INSERT INTO settings(key,value) VALUES (?,?),(?,?)',args:['company',JSON.stringify(defaultCompany),'initialized','true']});
for(const item of defaultItems){
  await db.execute({sql:'INSERT INTO content(id,kind,title,category,description,price,image,published,position,data,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',args:[item.id,item.kind,item.title,item.category,item.description,item.price,item.image,Number(item.published),item.position,JSON.stringify({stack:item.stack,features:item.features,technologies:item.technologies,icon:item.icon,delivery:item.delivery}),new Date().toISOString(),new Date().toISOString()]});
}
const adminToken=randomBytes(32).toString('hex'), hash=value=>createHash('sha256').update(value).digest('hex');
await db.execute({sql:'INSERT INTO admin_sessions(token_hash,email,credential_version,expires_at) VALUES(?,?,?,?)',args:[hash(adminToken),'admin@example.test',hash('isolated-hash'),Date.now()+600000]});
const catalogueFile=path.join(work,'catalogue.json'), callsFile=path.join(work,'calls.txt'), emailsFile=path.join(work,'emails.txt');
await writeFile(callsFile,''); await writeFile(emailsFile,'');
const project={id:'gid://shopify/Product/1',handle:'healthwise-ai',title:'Isolated capacity project',description:'Project used only by isolated scaling tests.',tags:['bebin-software','technology:Python','department:IT'],images:{nodes:[]},variants:{nodes:[{id:'gid://shopify/ProductVariant/42',availableForSale:true,price:{amount:'1000.00',currencyCode:'INR'}}]}};
await writeFile(catalogueFile,JSON.stringify([project]));
await db.execute({sql:'INSERT INTO project_packages(handle,variant_id,blob_url,filename,sha256,size,ready,updated_at) VALUES(?,?,?,?,?,?,1,?)',args:['healthwise-ai',project.variants.nodes[0].id,'https://example.invalid/private.zip','test.zip','test',123,new Date().toISOString()]});
const port=await new Promise(resolve=>{const server=createServer();server.listen(0,'127.0.0.1',()=>{const value=server.address().port;server.close(()=>resolve(value));});});
const base='http://127.0.0.1:'+port;
const preload=pathToFileURL(path.join(root,'tests/support/scaling-providers.mjs')).href;
const env={...process.env,NODE_OPTIONS:'--import='+preload,TURSO_DATABASE_URL:dbUrl,TURSO_AUTH_TOKEN:'',SHOPIFY_STORE_DOMAIN:'isolated-'+path.basename(work)+'.myshopify.com',SHOPIFY_STOREFRONT_ACCESS_TOKEN:'not-a-real-token',ADMIN_EMAIL:'admin@example.test',ADMIN_PASSWORD_HASH:'isolated-hash',DELIVERY_ENCRYPTION_KEY:randomBytes(32).toString('base64'),GMAIL_APP_PASSWORD:'',SCALING_TEST_MODE:'isolated',SCALING_TEST_CATALOGUE:catalogueFile,SCALING_TEST_CALLS:callsFile,SCALING_TEST_EMAILS:emailsFile,VERCEL:'0',NEXT_PUBLIC_SITE_URL:base,NEXT_TELEMETRY_DISABLED:'1'};
let logs='';
const app=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--hostname','127.0.0.1','--port',String(port)],{env,windowsHide:true});
app.stdout.on('data',data=>logs=(logs+data).slice(-50000)); app.stderr.on('data',data=>logs=(logs+data).slice(-50000));
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function get(route){return fetch(base+route,{signal:AbortSignal.timeout(30000)});}
async function post(route,body,admin=false,method='POST'){
  return fetch(base+route,{method,headers:{Origin:base,'Content-Type':'application/json','X-Bebin-Request':'1',...(admin?{cookie:'bebin_admin_session='+adminToken}:{})},body:JSON.stringify(body),signal:AbortSignal.timeout(30000)});
}
try {
  for(let attempt=0;;attempt++){
    if(app.exitCode!==null)throw Error('Local server exited: '+logs);
    try{if((await get('/api/health')).ok)break;}catch{}
    if(attempt>=60)throw Error('Local server failed to start: '+logs);
    await pause(500);
  }
  const initial=await (await get('/api/catalog')).json();
  assert.ok(initial.company);assert.match((await get('/api/catalog')).headers.get('cache-control'),/s-maxage=60/);
  const item={kind:'service',title:'Isolated test service',category:'Web',description:'A service created only inside the isolated scaling database.',price:null,image:'',published:true,position:0,stack:[],features:[],technologies:[],icon:'code',delivery:''};
  let response=await post('/api/admin/items',item,true);assert.equal(response.status,201);const listing=await response.json();
  let current=await (await get('/api/catalog')).json();assert.ok(current.items.some(item=>item.id===listing.id),'Create invalidates the shared content cache');
  response=await post('/api/admin/items/'+listing.id,{...item,title:'Updated isolated service'},true,'PUT');assert.equal(response.status,200);
  current=await (await get('/api/catalog')).json();assert.equal(current.items.find(item=>item.id===listing.id).title,'Updated isolated service','Update invalidates cached data');
  response=await fetch(base+'/api/admin/items/'+listing.id,{method:'DELETE',headers:{Origin:base,'X-Bebin-Request':'1',cookie:'bebin_admin_session='+adminToken}});assert.equal(response.status,200);
  current=await (await get('/api/catalog')).json();assert.ok(!current.items.some(item=>item.id===listing.id),'Delete invalidates cached data');
  console.log('PASS: published-content cache and authenticated create/update/delete invalidation.');

  // Warm the shared catalogue, then ensure repeated browsing avoids Shopify.
  assert.equal((await get('/projects')).status,200);
  const before=(await readFile(callsFile,'utf8')).trim().split('\n').filter(Boolean).length;
  const reads=await Promise.all(Array.from({length:24},()=>get('/projects')));
  for(const response of reads){assert.equal(response.status,200);await response.arrayBuffer();}
  const after=(await readFile(callsFile,'utf8')).trim().split('\n').filter(Boolean).length;
  assert.equal(after,before,'Warm catalogue browsing must not call Shopify per request');
  project.variants.nodes[0].price.amount='1500.00';await writeFile(catalogueFile,JSON.stringify([project]));
  response=await post('/api/checkout',{handle:'healthwise-ai',email:'buyer@example.test',name:'Isolated Buyer',phone:'8807336368',expectedAmount:'1000.00'});assert.equal(response.status,409,'A stale displayed price must not silently create a different payment');assert.equal(Number((await db.execute('SELECT count(*) AS n FROM manual_orders')).rows[0].n),0);
  response=await post('/api/checkout',{handle:'healthwise-ai',email:'buyer@example.test',name:'Isolated Buyer',phone:'8807336368',expectedAmount:'1500.00'});assert.equal(response.status,200);const order=await response.json();assert.equal(order.amount,'1500.00','Checkout bypasses cached public pricing');
  response=await post('/api/manual-order',{id:order.id,access:order.access});const pending=await response.json();assert.equal(pending.status,'pending');assert.equal(pending.download,null);
  assert.equal((await post('/api/manual-admin',{id:order.id,action:'approve',verified:true,reference:'987654321012'})).status,401);
  assert.equal(Number((await db.execute('SELECT count(*) AS n FROM digital_deliveries')).rows[0].n),0);
  console.log('PASS: 24 concurrent catalogue reads reused cached data; checkout used fresh pricing; unapproved/unauthenticated requests did not unlock delivery.');

  // Compile the actual non-UI server modules for independent Node workers.
  // Different processes share only the database, just as autoscaled instances do.
  const runtime=path.join(work,'runtime');await mkdir(path.join(runtime,'lib'),{recursive:true});
  for(const name of (await readdir('lib')).filter(name=>name.endsWith('.ts'))){
    const source=await readFile('lib/'+name,'utf8');
    let code=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
    code=code.replace(/(from\s+['"])(\.\.?\/[^'"]+)(['"])/g,(_,prefix,spec,suffix)=>prefix+spec+'.mjs'+suffix);
    code=code.replace(/(['"])next\/(cache|headers)\1/g,(_,quote,name)=>quote+'next/'+name+'.js'+quote);
    await writeFile(path.join(runtime,'lib',name.replace(/\.ts$/,'.mjs')),code);
  }
  const worker=path.join(runtime,'worker.mjs');
  await writeFile(worker,`import {approveManual,sendManualEmail} from './lib/manual-upi.mjs';\ntry {if(process.argv[2]==='approve')await approveManual(process.argv[3],'987654321012','admin@example.test');else await sendManualEmail(process.argv[3]);}catch(error){if(error.status!==409)throw error;}\n`);
  await db.execute({sql:"UPDATE manual_orders SET status='submitted',payment_proof_url='isolated-proof',submitted_at=? WHERE id=?",args:[new Date().toISOString(),order.id]});
  async function workers(mode){const results=await Promise.allSettled(Array.from({length:6},()=>new Promise((resolve,reject)=>{
    const child=spawn(process.execPath,['--conditions=react-server',worker,mode,order.id],{env:{...env,NODE_ENV:'test',GMAIL_APP_PASSWORD:mode==='send'?'isolated-mock-only':''},windowsHide:true});let output='';child.stderr.on('data',data=>output+=data);child.once('error',reject);child.once('exit',code=>code===0?resolve():reject(Error(output||'Worker failed')));
  })));const failed=results.find(result=>result.status==='rejected');if(failed)throw failed.reason;}
  await workers('approve');
  for(const table of ['digital_deliveries','delivery_outbox','manual_payment_audit'])assert.equal(Number((await db.execute('SELECT count(*) AS n FROM '+table)).rows[0].n),1,table+' must have exactly one grant');
  await workers('send');
  assert.equal((await readFile(emailsFile,'utf8')).trim().split('\n').length,1,'Concurrent processes must not send duplicate emails');
  const outbox=(await db.execute('SELECT status,attempts FROM delivery_outbox')).rows[0];assert.equal(outbox.status,'sent');assert.equal(Number(outbox.attempts),1);
  console.log('PASS: six independent approval workers created one delivery; six independent send workers produced one mock email. No real email sent.');
  const probes=await Promise.all(Array.from({length:50},()=>get('/api/health')));for(const response of probes){assert.equal(response.status,200);assert.match(response.headers.get('cache-control'),/no-store/);await response.arrayBuffer();}
  const privateResponse=await get('/api/admin/items');assert.equal(privateResponse.status,401);assert.match(privateResponse.headers.get('cache-control'),/no-store/);
  console.log('PASS: concurrent liveness probes and uncached protected administrator responses.');
  const loadReport=await new Promise((resolve,reject)=>{
    const load=spawn(process.execPath,['scripts/load-readonly.mjs'],{env:{...process.env,LOAD_TEST_URL:base,LOAD_TEST_REQUESTS:'200',LOAD_TEST_CONCURRENCY:'10',LOAD_TEST_PATHS:'/projects,/services,/api/health'},windowsHide:true});let output='',errors='';load.stdout.on('data',data=>output+=data);load.stderr.on('data',data=>errors+=data);load.once('error',reject);load.once('exit',code=>code===0?resolve(JSON.parse(output)):reject(Error(errors||output)));
  });
  await writeFile(path.join(work,'load-report.json'),JSON.stringify(loadReport,null,2));
  console.log('LOCAL READ-ONLY LOAD TEST (not production capacity): '+JSON.stringify(loadReport));
} finally {
  app.kill();db.close();await writeFile(path.join(work,'server.log'),logs);
}
