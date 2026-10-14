import { Site } from '@/components/site';
import { publicData } from '@/lib/server';
export const dynamic='force-dynamic';
export const metadata={title:'Contact Us',description:'Contact Bebin Tech at 8807336368 or bbebinr@gmail.com for projects, software, ERP, and web or mobile development.'};
export default async function Page({searchParams}:{searchParams:Promise<{project?:string;type?:string}>}){const query=await searchParams;const data=await publicData();return <Site mode="contact" data={data} initialType={query.type} selectedItem={data.items.find(i=>i.id===query.project&&(i.kind==='project'||i.kind==='product'))}/>;}
