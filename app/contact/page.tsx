import {pageMetadata} from '@/lib/seo';
import { Site } from '@/components/site';
import { publicData } from '@/lib/server';
export const dynamic='force-dynamic';
export const metadata=pageMetadata('Contact Us','Contact Bebin Tech at 8807336368 or bbebinr@gmail.com for projects, software, ERP, and web or mobile development.','/contact');
export default async function Page({searchParams}:{searchParams:Promise<{project?:string;type?:string}>}){const query=await searchParams;const data=await publicData();return <Site mode="contact" data={data} initialType={query.type} selectedItem={data.items.find(i=>i.id===query.project&&(i.kind==='project'||i.kind==='product'))}/>;}
