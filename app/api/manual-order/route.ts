import {database,sameOrigin,jsonBody,result,failure,HttpError} from '@/lib/server';
import {tokenHash} from '@/lib/digital-delivery';
import {manualDownload} from '@/lib/manual-upi';
import {z} from 'zod';
export async function POST(request:Request){try{sameOrigin(request);const {id,access}=z.object({id:z.string().regex(/^BT[A-F0-9]{20}$/),access:z.string().regex(/^[a-f0-9]{64}$/)}).strict().parse(await jsonBody(request));const row=await database().prepare('SELECT status,rejection_reason,submitted_at FROM manual_orders WHERE id=? AND access_hash=?').bind(id,tokenHash(access)).first<{status:string;rejection_reason:string|null;submitted_at:string|null}>();if(!row)throw new HttpError(404,'Order not found.');const download=row.status==='approved'?await manualDownload(id):null;return result({status:row.status,download,rejectionReason:row.rejection_reason,submittedAt:row.submitted_at,expired:row.status==='approved'&&!download});}catch(e){return failure(e);}}
