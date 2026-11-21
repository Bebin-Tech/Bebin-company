import { ModernHome } from '@/components/home';
import {softwareProjects} from '@/lib/shopify';
import { publicData } from '@/lib/server';
import {absoluteUrl,pageMetadata} from '@/lib/seo';
import {StructuredData} from '@/components/structured-data';
import {founderPortraitPath} from '@/lib/portrait';
export const metadata=pageMetadata('Final-Year Software Projects with Source Code','Buy final-year software projects for IT, BCA, B.Sc Computer Science and AI & Data Science. Explore source code, database setup and installation guides.','/');
export const dynamic='force-dynamic';
export default async function Home(){const [data,projects]=await Promise.all([publicData(),softwareProjects().catch(()=>[])]);return <><StructuredData data={{'@context':'https://schema.org','@graph':[{'@type':'Organization','@id':absoluteUrl('/#organization'),name:'Bebin Tech',url:absoluteUrl('/'),logo:absoluteUrl('/bebin-logo-clear.webp'),founder:{'@type':'Person','@id':absoluteUrl('/bebin-r#person'),name:'Bebin R',url:absoluteUrl('/bebin-r'),image:absoluteUrl(founderPortraitPath)},email:'bbebinr@gmail.com',telephone:'+918807336368',sameAs:['https://github.com/Bebin-Tech']},{'@type':'WebSite','@id':absoluteUrl('/#website'),name:'Bebin Tech',url:absoluteUrl('/'),publisher:{'@id':absoluteUrl('/#organization')}}]}}/><ModernHome data={data} projects={projects}/></>;}
