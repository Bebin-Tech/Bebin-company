import { Site } from '@/components/site';
import { publicData } from '@/lib/server';
export const dynamic='force-dynamic';
export default async function Home(){return <Site mode="home" data={await publicData()}/>;}
