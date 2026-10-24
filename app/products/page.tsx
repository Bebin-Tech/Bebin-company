import {pageMetadata} from '@/lib/seo';
import { Site } from '@/components/site';
import { publicData } from '@/lib/server';
export const dynamic='force-dynamic';
export const metadata=pageMetadata('Products & ERP Solutions','Explore Bebin Tech software products, college ERP, business management, and custom web and mobile solutions.','/products');
export default async function Page(){return <Site mode="products" data={await publicData()}/>;}
