import 'server-only';
import {put,get,del} from '@vercel/blob';
import {database} from './database';
export function bucket(){return {
 async put(id:string,bytes:Uint8Array,options:{httpMetadata:{contentType:string}}){const blob=await put(`bebin-images/${id}`,Buffer.from(bytes),{access:'private',contentType:options.httpMetadata.contentType,addRandomSuffix:false});return {url:blob.url};},
 async get(id:string){const row=await database().prepare('SELECT blob_url FROM media WHERE id=?').bind(id).first<{blob_url:string|null}>();if(!row?.blob_url)return null;const response=await get(row.blob_url,{access:'private'});return response&&response.statusCode===200?{body:response.stream}:null;},
 async delete(url:string){await del(url);},
};}
