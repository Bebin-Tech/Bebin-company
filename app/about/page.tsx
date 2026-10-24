import {pageMetadata} from '@/lib/seo';
import { Site } from '@/components/site';
import { publicData } from '@/lib/server';
export const dynamic='force-dynamic';
export const metadata=pageMetadata('About Bebin Tech & Founder Bebin R','Meet Bebin Tech and founder Bebin R, a software developer specializing in web, mobile, custom software, and ERP solutions.','/about');
export default async function Page(){return <Site mode="about" data={await publicData()}/>;}
