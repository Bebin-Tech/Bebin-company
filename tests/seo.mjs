import assert from 'node:assert/strict';
const base=process.env.SEO_TEST_URL||'http://127.0.0.1:3004';
const canonical=process.env.SEO_CANONICAL_URL||'https://bebin-tech-projects.vercel.app';
const prices={'college-parking':4500,'company-management':2000,'event-booking':1000,'healthwise-ai':1000,'placement-app':5000,'smart-energy':1000,'visitor-management':3500};
const structured=html=>[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match=>JSON.parse(match[1]));
for(const path of ['/','/projects','/about','/bebin-r','/services','/technologies','/contact',...Object.keys(prices).map(id=>`/projects/${id}`)]){
  const response=await fetch(base+path);assert.equal(response.status,200,path);
  const html=await response.text();
  const canonicalTag=html.match(/<link rel="canonical" href="([^"]+)"/);
  assert.equal(new URL(canonicalTag?.[1]).href,new URL(path,canonical).href,`canonical ${path}`);
  assert.match(html,/<meta name="description" content="[^"]+"/);
  assert.ok(!html.includes('name="robots" content="noindex'),`public indexable ${path}`);
  assert.deepEqual([...html.matchAll(/property="og:image" content="([^"]+)"/g)].map(match=>match[1]),[canonical+'/bebin-r-founder.jpg'],`Current photo is the only sharing preview ${path}`);
  assert.equal(html.match(/name="twitter:image" content="([^"]+)"/)?.[1],canonical+'/bebin-r-founder.jpg',`Current Twitter preview ${path}`);
  assert.ok(!html.includes('/founder-profile.jpg')&&!html.includes('/bebin-r-portrait.png'),`No retired founder images ${path}`);
  if(path==='/')assert.ok(structured(html).some(data=>data['@graph']?.some(node=>node['@type']==='Organization')));
  const id=path.split('/')[2];
  if(id){const graph=structured(html).flatMap(data=>data['@graph']||[]);const product=graph.find(node=>node['@type']==='Product');assert.equal(Number(product.offers.price),prices[id]);assert.equal(product.offers.priceCurrency,'INR');assert.equal(product.url,canonical+path);assert.ok(graph.some(node=>node['@type']==='BreadcrumbList'));}
}
const profileHtml=await (await fetch(base+'/bebin-r')).text();
const profile=structured(profileHtml).find(data=>data['@type']==='ProfilePage');
assert.equal(profile.mainEntity.name,'Bebin R');
assert.equal(profile.mainEntity.image,canonical+'/bebin-r-founder.jpg');
assert.ok(profile.mainEntity.sameAs.includes('https://bebin-tech.vercel.app/'));
assert.equal(profile.primaryImageOfPage.contentUrl,canonical+'/bebin-r-founder.jpg');
const aboutHtml=await (await fetch(base+'/about')).text();
const about=structured(aboutHtml).find(data=>data['@type']==='AboutPage');
assert.equal(about.primaryImageOfPage.contentUrl,profile.primaryImageOfPage.contentUrl);
assert.ok(about.about.some(entity=>entity['@id']===profile.mainEntity['@id']));
const aboutMain=aboutHtml.match(/<main id="main">([\s\S]*?)<\/main>/)?.[1];
assert.ok(aboutMain?.includes('src="/bebin-r-founder.jpg"'));
assert.ok(!aboutMain.includes('src="/bebin-logo.png"'),'About content prioritizes the founder portrait');
assert.ok(aboutMain.includes('href="/bebin-r"'),'Founder biography link');
for(const html of [profileHtml,aboutHtml]){
  assert.ok(html.includes('max-image-preview:large'));
  assert.ok(html.includes('property="og:image" content="'+canonical+'/bebin-r-founder.jpg"'));
}
assert.ok(profileHtml.includes('property="og:image" content="'+canonical+'/bebin-r-founder.jpg"'));
const portrait=await fetch(base+'/bebin-r-founder.jpg');assert.equal(portrait.status,200);assert.match(portrait.headers.get('content-type')||'',/image/);
const filtered=await (await fetch(base+'/projects?q=management')).text();assert.ok(filtered.includes('name="robots" content="noindex, follow"'));
const admin=await fetch(base+'/admin');assert.match(admin.headers.get('x-robots-tag')||'',/noindex/);
const missing=await fetch(base+'/projects/does-not-exist');assert.equal(missing.status,404);
const removedProducts=await fetch(base+'/products',{redirect:'manual'});assert.equal(removedProducts.status,308);assert.equal(new URL(removedProducts.headers.get('location'),base).pathname,'/services');
const sitemap=await (await fetch(base+'/sitemap.xml')).text();assert.equal((sitemap.match(/<loc>/g)||[]).length,14);assert.ok(!/\/admin|\/api\/|\.zip/.test(sitemap));
assert.ok(!sitemap.includes(canonical+'/products'));
assert.equal((sitemap.match(/<image:loc>/g)||[]).length,2);
assert.ok(sitemap.includes('<image:loc>'+canonical+'/bebin-r-founder.jpg</image:loc>'));
const robots=await (await fetch(base+'/robots.txt')).text();assert.ok(robots.includes(`Sitemap: ${canonical}/sitemap.xml`));
console.log('SEO checks passed: 14 canonical pages, seven actual product prices, structured data, filtered search, admin noindex, 404, sitemap and robots.');

for(const path of ['/founder-profile.jpg','/bebin-r-portrait.png']){
 for(const old of [path,'/_next/image?url='+encodeURIComponent(path)+'&w=640&q=75']){
  const response=await fetch(base+old,{redirect:'manual'});assert.equal(response.status,308,'Retired portrait redirect '+old);
  assert.equal(new URL(response.headers.get('location'),base).pathname,'/bebin-r-founder.jpg');
 }
}
console.log('Retired portrait originals and optimized URLs redirect to the current photo.');
