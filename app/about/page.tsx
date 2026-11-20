import {absoluteUrl,pageMetadata} from '@/lib/seo';
import {StructuredData} from '@/components/structured-data';
import {founderPortrait} from '@/lib/founder';
import {portfolioPortraitPath} from '@/lib/portrait';
import { Site } from '@/components/site';
import { publicData } from '@/lib/server';
export const dynamic='force-dynamic';
const base=pageMetadata('About Bebin Tech & Founder Bebin R','Meet Bebin Tech and founder Bebin R, a software developer specializing in web, mobile, custom software, and ERP solutions.','/about');
const aboutPortrait={...founderPortrait,'@id':absoluteUrl('/about#portrait'),url:absoluteUrl(portfolioPortraitPath),contentUrl:absoluteUrl(portfolioPortraitPath),width:843,height:1024};
export const metadata={...base,robots:{index:true,follow:true,'max-image-preview':'large' as const},openGraph:{...base.openGraph,images:[{url:aboutPortrait.url,width:843,height:1024,alt:aboutPortrait.caption}]},twitter:{...base.twitter,card:'summary_large_image' as const,images:[aboutPortrait.url]}};
export default async function Page(){const data=await publicData();return <><StructuredData data={{'@context':'https://schema.org','@type':'AboutPage',url:absoluteUrl('/about'),name:'About Bebin Tech & Founder Bebin R',primaryImageOfPage:aboutPortrait,about:[{'@type':'Organization','@id':absoluteUrl('/#organization'),name:'Bebin Tech',url:absoluteUrl('/')},{'@type':'Person','@id':absoluteUrl('/bebin-r#person'),name:'Bebin R',url:absoluteUrl('/bebin-r'),image:aboutPortrait.url,description:data.company.biography}]}}/><Site mode="about" data={data}/></>;}
