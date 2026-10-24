import {pageMetadata} from '@/lib/seo';
import { Site } from '@/components/site';
import { publicData } from '@/lib/server';
export const dynamic='force-dynamic';
export const metadata=pageMetadata('Software Development Services','Web, mobile, software, ERP, final-year projects, AI and ML, and project customization services from Bebin Tech.','/services');
export default async function Page(){return <Site mode="services" data={await publicData()}/>;}
