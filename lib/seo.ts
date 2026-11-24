import type {Metadata} from 'next';
import {siteUrl} from './site-url';
import {founderPortraitPath} from './portrait';

export function absoluteUrl(path:string){return new URL(path,siteUrl()).toString();}
export function pageMetadata(title:string,description:string,path:string):Metadata {
  const url=absoluteUrl(path);
  const image=absoluteUrl(founderPortraitPath);
  return {title,description,alternates:{canonical:url},robots:{'max-image-preview':'large'},openGraph:{title:`${title} | Bebin Tech`,description,url,siteName:'Bebin Tech',locale:'en_IN',type:'website',images:[{url:image,width:660,height:652,alt:'Bebin R — Founder & Software Developer at Bebin Tech'}]},twitter:{card:'summary_large_image',title:`${title} | Bebin Tech`,description,images:[image]}};
}
