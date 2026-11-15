import {pageMetadata} from '@/lib/seo';
import { Site } from '@/components/site';
import { publicData } from '@/lib/server';
export const dynamic='force-dynamic';
const base=pageMetadata('About Bebin Tech & Founder Bebin R','Meet Bebin Tech and founder Bebin R, a software developer specializing in web, mobile, custom software, and ERP solutions.','/about');
export const metadata={...base,openGraph:{...base.openGraph,images:[{url:'/founder-profile.jpg',alt:'Bebin R — Founder & Software Developer'}]},twitter:{...base.twitter,images:['/founder-profile.jpg']}};
export default async function Page(){return <Site mode="about" data={await publicData()}/>;}
