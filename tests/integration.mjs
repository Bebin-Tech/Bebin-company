import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const base='http://127.0.0.1:3000';
let cookie='';const created={items:[],enquiries:[],orders:[]};
async function request(path,{method='GET',body,auth=false,origin=base,headers={},raw}={}){const res=await fetch(base+path,{method,headers:{'X-Bebin-Request':'1',...(method!=='GET'?{Origin:origin}:{}),...(body?{'Content-Type':'application/json'}:{}),...(auth?{Cookie:cookie}:{}),...headers},...(body?{body:JSON.stringify(body)}:{}),...(raw?{body:raw}:{})});const text=await res.text();let data;try{data=JSON.parse(text);}catch{data=text;}return {status:res.status,data,res};}
function okay(response,status=200){assert.equal(response.status,status,JSON.stringify(response.data));return response.data;}
try{
  const password=(await readFile('outputs/initial-admin-login.txt','utf8')).match(/Password: (.+)/)[1];
  const signed=await request('/api/auth/login',{method:'POST',body:{email:'bbebinr@gmail.com',password}});okay(signed);cookie=signed.res.headers.get('set-cookie')?.split(';')[0]||'';assert(cookie,'Administrator sign-in failed');
  assert.equal((await request('/api/admin/items')).status,401,'Anonymous admin access must be rejected');
  assert.equal((await request('/api/admin/items',{headers:{'oai-authenticated-user-email':'seedy@sites.test','oai-authenticated-user-id':'local_seedy'}})).status,401,'Spoofed identity headers must be stripped');
  okay(await request('/api/admin/bootstrap',{method:'POST',auth:true}));
  assert.equal((await request('/api/admin/bootstrap',{method:'POST',auth:true,origin:'https://attacker.example'})).status,403,'Cross-origin admin requests must be blocked');
  const catalogue=okay(await request('/api/catalog'));assert.equal(catalogue.items.filter(i=>i.kind==='service').length,8);assert.equal(catalogue.items.filter(i=>i.kind==='technology').length,44);
  const img=await readFile('public/bebin-logo.png');const image=okay(await request('/api/admin/upload',{method:'POST',auth:true,raw:img,headers:{'Content-Type':'image/png'}}),201);assert.match(image.url,/\/api\/media\//);const download=await fetch(base+image.url);assert.equal(download.status,200);assert.equal(download.headers.get('content-type'),'image/png');assert.equal((await download.arrayBuffer()).byteLength,img.length);
  assert.equal((await request('/api/admin/upload',{method:'POST',auth:true,raw:Buffer.from('<svg><script>alert(1)</script></svg>'),headers:{'Content-Type':'image/png'}})).status,400);
  const item={kind:'project',title:'Integration test learning project',category:'Python',description:'A disposable test listing for validating catalogue persistence and checkout.',price:350000,image:image.url,published:false,position:0,stack:['Python','Django'],features:['Source code as packaged','Project walkthrough'],technologies:['technology-0'],icon:'',delivery:'Test data only.'};
  assert.equal((await request('/api/admin/items',{method:'POST',auth:true,body:{...item,price:-1}})).status,400);
  const saved=okay(await request('/api/admin/items',{method:'POST',auth:true,body:item}),201);created.items.push(saved.id);
  assert(!okay(await request('/api/catalog')).items.some(i=>i.id===saved.id),'Drafts must stay private');
  okay(await request(`/api/admin/items/${saved.id}`,{method:'PUT',auth:true,body:{...item,published:true}}));
  assert(okay(await request('/api/catalog')).items.some(i=>i.id===saved.id),'Published project must be visible');
  assert.equal((await request('/api/admin/items/technology-0',{method:'DELETE',auth:true})).status,409,'Linked technologies must not be deleted');
  const detail=await fetch(base+`/projects/${saved.id}`);assert.equal(detail.status,200);assert((await detail.text()).includes(item.title));
  const enquiry={name:'Local test customer',email:'local-test@example.com',phone:'8807336368',projectType:'Final-Year Project',message:'Please explain the package and its source code inclusions.',projectId:saved.id,website:''};
  assert.equal((await request('/api/enquiries',{method:'POST',body:{...enquiry,email:'invalid'}})).status,400);
  assert.equal((await request('/api/enquiries',{method:'POST',body:{...enquiry,website:'spam'}})).status,400);
  const enq=okay(await request('/api/enquiries',{method:'POST',body:enquiry}),201);created.enquiries.push(enq.id);
  assert(okay(await request('/api/admin/enquiries',{auth:true})).some(e=>e.id===enq.id));
  okay(await request(`/api/admin/enquiries/${enq.id}`,{method:'PUT',auth:true,body:{status:'resolved'}}));
  assert.equal(okay(await request('/api/admin/enquiries',{auth:true})).find(e=>e.id===enq.id).status,'resolved');
  const order=okay(await request('/api/orders',{method:'POST',body:{projectId:saved.id,name:'Local test customer',email:'local-test@example.com',phone:'8807336368',notes:'Test only',website:''}}),201);created.orders.push(order.id);assert(order.whatsappUrl.startsWith('https://wa.me/918807336368?text='));
  okay(await request(`/api/admin/items/${saved.id}`,{method:'PUT',auth:true,body:{...item,published:true,price:490000}}));
  assert.equal(okay(await request('/api/admin/orders',{auth:true})).find(o=>o.id===order.id).quoted_price,350000,'Order must retain original price snapshot');
  const company=okay(await request('/api/admin/company',{auth:true}));okay(await request('/api/admin/company',{method:'PUT',auth:true,body:{...company,tagline:'Integration test company tagline'}}));assert.equal(okay(await request('/api/catalog')).company.tagline,'Integration test company tagline');okay(await request('/api/admin/company',{method:'PUT',auth:true,body:company}));
  for(const kind of ['service','technology','product']){const p={...item,kind,title:'Temporary '+kind,technologies:[],price:null};const added=okay(await request('/api/admin/items',{method:'POST',auth:true,body:p}),201);created.items.push(added.id);okay(await request(`/api/admin/items/${added.id}`,{method:'PUT',auth:true,body:{...p,title:'Updated '+kind}}));}
  for(const path of ['/','/projects','/products','/services','/about','/contact','/technologies','/robots.txt','/sitemap.xml']){const response=await fetch(base+path);assert.equal(response.status,200,path);}
  let throttled=false;for(let i=0;i<14;i++){const attempt=await request('/api/enquiries',{method:'POST',body:{...enquiry,message:'Disposable local request for verifying abuse protection.'}});if(attempt.status===429){throttled=true;break;}okay(attempt,201);created.enquiries.push(attempt.data.id);}assert(throttled,'Repeated public submissions must be rate-limited');
  okay(await request('/api/auth/logout',{method:'POST',auth:true})); assert.equal((await request('/api/admin/items',{auth:true})).status,401,'Logged-out sessions must be revoked');
  const resigned=await request('/api/auth/login',{method:'POST',body:{email:'bbebinr@gmail.com',password}});okay(resigned);cookie=resigned.res.headers.get('set-cookie').split(';')[0];
  console.log('PASS: authentication, spoofed-header rejection, origin validation, persistent content CRUD, draft visibility, uploads, input validation, enquiries, order snapshots, company settings, public routes, and submission rate limits.');
}finally{for(const id of created.orders)await request(`/api/admin/orders/${id}`,{method:'DELETE',auth:true});for(const id of created.enquiries)await request(`/api/admin/enquiries/${id}`,{method:'DELETE',auth:true});for(const id of created.items)await request(`/api/admin/items/${id}`,{method:'DELETE',auth:true});}
