import {performance} from 'node:perf_hooks';

const target=new URL(process.env.LOAD_TEST_URL||'http://127.0.0.1:3000');
if(target.username||target.password||!['http:','https:'].includes(target.protocol))throw Error('Use an HTTP(S) origin without credentials.');
const local=['127.0.0.1','localhost','[::1]'].includes(target.hostname);
if(!local&&process.env.LOAD_TEST_ALLOW_REMOTE!=='1')throw Error('Remote load tests are disabled. Set LOAD_TEST_ALLOW_REMOTE=1 only for an authorized target with a traffic budget.');
function bounded(name,fallback,max){const value=Number(process.env[name]||fallback);if(!Number.isInteger(value)||value<1||value>max)throw Error(name+' must be between 1 and '+max);return value;}
const total=bounded('LOAD_TEST_REQUESTS',200,5000),concurrency=bounded('LOAD_TEST_CONCURRENCY',10,100);
const allowed=new Set(['/','/projects','/services','/about','/api/health']);
const paths=(process.env.LOAD_TEST_PATHS||'/,/projects,/services,/api/health').split(',');
if(paths.some(path=>!allowed.has(path)))throw Error('Only the allowlisted public read-only routes may be tested.');
async function request(path){const response=await fetch(new URL(path,target.origin),{signal:AbortSignal.timeout(30000),redirect:'error'});await response.arrayBuffer();return response.status;}
for(const path of paths){if(await request(path)!==200)throw Error('Warm-up failed for '+path);}
let next=0;const timings=[],statuses={};const start=performance.now();
await Promise.all(Array.from({length:Math.min(concurrency,total)},async()=>{
  while(next<total){const index=next++,began=performance.now();let status='network_error';try{status=String(await request(paths[index%paths.length]));}catch{}timings.push(performance.now()-began);statuses[status]=(statuses[status]||0)+1;}
}));
const elapsed=performance.now()-start;timings.sort((a,b)=>a-b);
const percentile=p=>Math.round(timings[Math.min(timings.length-1,Math.ceil(timings.length*p)-1)]);
const report={origin:target.origin,scope:local?'local test, not production capacity':'authorized remote test',requests:total,concurrency,paths,statuses,elapsedMs:Math.round(elapsed),requestsPerSecond:Number((total/(elapsed/1000)).toFixed(2)),p50Ms:percentile(.5),p95Ms:percentile(.95),p99Ms:percentile(.99)};
console.log(JSON.stringify(report,null,2));
if(statuses['200']!==total)process.exitCode=1;
