import {siteUrl} from '@/lib/site-url';
import { publicData } from '@/lib/server';
export const dynamic='force-dynamic';
export default async function sitemap(){const base=siteUrl();const data=await publicData();return [...['','/projects','/services','/products','/technologies','/about','/contact'].map(path=>({url:base+path})),...data.items.filter(i=>i.kind==='project').map(item=>({url:`${base}/projects/${item.id}`,lastModified:item.updatedAt}))];}
