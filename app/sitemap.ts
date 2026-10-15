import {siteUrl} from '@/lib/site-url';import {softwareProjects} from '@/lib/shopify';
export const dynamic='force-dynamic';
export default async function sitemap(){const base=siteUrl();let projects:{handle:string}[]=[];try{projects=await softwareProjects();}catch{}return [...['','/projects','/services','/products','/technologies','/about','/contact'].map(path=>({url:base+path})),...projects.map(project=>({url:`${base}/projects/${project.handle}`}))];}
