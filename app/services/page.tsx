import { Site } from '@/components/site';
import { publicData } from '@/lib/server';
export const dynamic='force-dynamic';
export const metadata={title:'Software Development Services',description:'Web, mobile, software, ERP, final-year projects, AI and ML, and project customization services from Bebin Tech.'};
export default async function Page(){return <Site mode="services" data={await publicData()}/>;}
