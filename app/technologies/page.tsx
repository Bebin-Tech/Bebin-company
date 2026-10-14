import { Site } from '@/components/site';
import { publicData } from '@/lib/server';
export const dynamic='force-dynamic';
export const metadata={title:'Technologies & Development',description:'Explore Python, Java, React, Django, Flutter, AI and ML, databases, and the technologies supported by Bebin Tech.'};
export default async function Page({searchParams}:{searchParams:Promise<{q?:string}>}){const {q}=await searchParams;return <Site mode="technologies" data={await publicData()} initialQuery={q}/>;}
