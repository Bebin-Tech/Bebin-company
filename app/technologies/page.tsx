import {pageMetadata} from '@/lib/seo';
import { Site } from '@/components/site';
import { publicData } from '@/lib/server';
export const dynamic='force-dynamic';
export const metadata=pageMetadata('Technologies & Development','Explore Python, Java, React, Django, Flutter, AI and ML, databases, and the technologies supported by Bebin Tech.','/technologies');
export default async function Page({searchParams}:{searchParams:Promise<{q?:string}>}){const {q}=await searchParams;return <Site mode="technologies" data={await publicData()} initialQuery={q}/>;}
