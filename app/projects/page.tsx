import { Site } from '@/components/site';
import { publicData } from '@/lib/server';
export const dynamic='force-dynamic';
export const metadata={title:'Final-Year Project Store',description:'Browse college and final-year projects by category and technology. Enquire about packages, customization, and source code.'};
export default async function Page({searchParams}:{searchParams:Promise<{category?:string;technology?:string}>}){const query=await searchParams;return <Site mode="projects" data={await publicData()} initialCategory={query.category} initialTech={query.technology}/>;}
