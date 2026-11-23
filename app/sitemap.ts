import {siteUrl} from '@/lib/site-url';import {softwareProjects} from '@/lib/shopify';
import {founderPortrait} from '@/lib/founder';
export const revalidate=60;
export default async function sitemap(){const base=siteUrl();let projects:{handle:string}[]=[];try{projects=await softwareProjects();}catch{}return [...['','/projects','/services','/technologies','/about','/bebin-r','/contact'].map(path=>({url:base+path,...(['/about','/bebin-r'].includes(path)?{images:[founderPortrait.url]}:{})})),...projects.map(project=>({url:`${base}/projects/${project.handle}`}))];}
