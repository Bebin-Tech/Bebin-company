import assert from 'node:assert/strict';
const base=process.env.SEO_TEST_URL||'http://127.0.0.1:3004';
const canonical=process.env.SEO_CANONICAL_URL||'https://bebin-tech-projects.vercel.app';
const prices={'college-parking':4500,'company-management':2000,'event-booking':1000,'healthwise-ai':1000,'placement-app':5000,'smart-energy':1000,'visitor-management':3500};
const structured=html=>[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match=>JSON.parse(match[1]));
for(const path of ['/','/projects','/about','/services','/products','/technologies','/contact',...Object.keys(prices).map(id=>`/projects/${id}`)]){
  const response=await fetch(base+path);assert.equal(response.status,200,path);
  const html=await response.text();
  const canonicalTag=html.match(/<link rel="canonical" href="([^"]+)"/);
  assert.equal(new URL(canonicalTag?.[1]).href,new URL(path,canonical).href,`canonical ${path}`);
  assert.match(html,/<meta name="description" content="[^"]+"/);
  assert.ok(!html.includes('name="robots" content="noindex'),`public indexable ${path}`);
  if(path==='/')assert.ok(structured(html).some(data=>data['@graph']?.some(node=>node['@type']==='Organization')));
  const id=path.split('/')[2];
  if(id){const graph=structured(html).flatMap(data=>data['@graph']||[]);const product=graph.find(node=>node['@type']==='Product');assert.equal(Number(product.offers.price),prices[id]);assert.equal(product.offers.priceCurrency,'INR');assert.equal(product.url,canonical+path);assert.ok(graph.some(node=>node['@type']==='BreadcrumbList'));}
}
const filtered=await (await fetch(base+'/projects?q=management')).text();assert.ok(filtered.includes('name="robots" content="noindex, follow"'));
const admin=await fetch(base+'/admin');assert.match(admin.headers.get('x-robots-tag')||'',/noindex/);
const missing=await fetch(base+'/projects/does-not-exist');assert.equal(missing.status,404);
const sitemap=await (await fetch(base+'/sitemap.xml')).text();assert.equal((sitemap.match(/<loc>/g)||[]).length,14);assert.ok(!/\/admin|\/api\/|\.zip/.test(sitemap));
const robots=await (await fetch(base+'/robots.txt')).text();assert.ok(robots.includes(`Sitemap: ${canonical}/sitemap.xml`));
console.log('SEO checks passed: 14 canonical pages, seven actual product prices, structured data, filtered search, admin noindex, 404, sitemap and robots.');
