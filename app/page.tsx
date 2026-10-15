import { ModernHome } from '@/components/home';
import {softwareProjects} from '@/lib/shopify';
import { publicData } from '@/lib/server';
export const dynamic='force-dynamic';
export default async function Home(){const [data,projects]=await Promise.all([publicData(),softwareProjects().catch(()=>[])]);return <ModernHome data={data} projects={projects}/>;}
