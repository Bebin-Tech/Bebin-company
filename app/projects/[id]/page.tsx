import {ProjectStore} from '@/components/project-store';
import {StructuredData} from '@/components/structured-data';
import {publicData} from '@/lib/server';
import {softwareProjects} from '@/lib/shopify';
import {absoluteUrl,pageMetadata} from '@/lib/seo';
import {notFound} from 'next/navigation';
export const revalidate=60;
export async function generateStaticParams(){return [];}
type Props={params:Promise<{id:string}>};
export async function generateMetadata({params}:Props){
  const {id}=await params;
  const project=(await softwareProjects()).find(p=>p.handle===id);
  if(!project)notFound();
  const description=project.description.replace(/\s+/g,' ').trim();
  const metadata=pageMetadata(`${project.title} — Source Code Project`,description.length>155?`${description.slice(0,152).trimEnd()}…`:description,`/projects/${project.handle}`);
  const image=project.images.nodes[0];
  return image?{...metadata,openGraph:{...metadata.openGraph,images:[{url:absoluteUrl(image.url),alt:image.altText||project.title}]},twitter:{...metadata.twitter,images:[absoluteUrl(image.url)]}}:metadata;
}
export default async function Page({params}:Props){
  const {id}=await params;
  const project=(await softwareProjects()).find(p=>p.handle===id);
  if(!project)notFound();
  const url=absoluteUrl(`/projects/${project.handle}`);
  const variant=project.variants.nodes[0];
  return <><StructuredData data={{'@context':'https://schema.org','@graph':[
    {'@type':'Product','@id':`${url}#product`,name:project.title,description:project.description,url,image:project.images.nodes.map(image=>absoluteUrl(image.url)),brand:{'@type':'Brand',name:'Bebin Tech'},...(variant?{offers:{'@type':'Offer',url,price:variant.price.amount,priceCurrency:variant.price.currencyCode,availability:variant.availableForSale?'https://schema.org/InStock':'https://schema.org/OutOfStock',seller:{'@type':'Organization',name:'Bebin Tech'}}}:{})},
    {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:absoluteUrl('/')},{'@type':'ListItem',position:2,name:'Software Projects',item:absoluteUrl('/projects')},{'@type':'ListItem',position:3,name:project.title,item:url}]}
  ]}}/><ProjectStore company={(await publicData()).company} projects={[]} selected={project}/></>;
}
