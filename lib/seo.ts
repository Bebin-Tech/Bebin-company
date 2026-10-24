import type {Metadata} from 'next';
import {siteUrl} from './site-url';

export function absoluteUrl(path:string){return new URL(path,siteUrl()).toString();}
export function pageMetadata(title:string,description:string,path:string):Metadata {
  const url=absoluteUrl(path);
  return {title,description,alternates:{canonical:url},openGraph:{title:`${title} | Bebin Tech`,description,url,siteName:'Bebin Tech',locale:'en_IN',type:'website',images:[{url:absoluteUrl('/bebin-logo.png'),alt:'Bebin Tech'}]},twitter:{card:'summary',title:`${title} | Bebin Tech`,description,images:[absoluteUrl('/bebin-logo.png')]}};
}
