import {database,sameOrigin,jsonBody,result,failure,HttpError} from '@/lib/server';
import {tokenHash} from '@/lib/digital-delivery';
import {manualDownload} from '@/lib/manual-upi';
import {z} from 'zod';
export async function POST(request:Request){try{sameOrigin(request);const {id,access}=z.object({id:z.string().regex(/^BT[A-F0-9]{20}$/),access:z.string().regex(/^[a-f0-9]{64}$/)}).strict().parse(await jsonBody(request));const row=await database().prepare('SELECT status FROM manual_orders WHERE id=? AND access_hash=?').bind(id,tokenHash(access)).first<{status:string}>();if(!row)throw new HttpError(404,'Order not found.');return result({status:row.status,download:row.status==='approved'?await manualDownload(id):null});}catch(e){return failure(e);}}
