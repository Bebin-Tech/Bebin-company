import { Site } from '@/components/site';
import { publicData } from '@/lib/server';
import { notFound } from 'next/navigation';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{id:string}>}){const {id}=await params;const data=await publicData();const item=data.items.find(i=>i.id===id&&i.kind==='project');return {title:item?.title||'Project',description:item?.description.slice(0,160)};}
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;const data=await publicData();const item=data.items.find(i=>i.id===id&&i.kind==='project');if(!item)notFound();return <Site mode="detail" data={data} item={item}/>;}
