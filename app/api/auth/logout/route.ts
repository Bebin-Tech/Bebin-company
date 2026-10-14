import {revokeSession,sessionCookie} from '@/lib/auth';
import {sameOrigin,result,failure} from '@/lib/server';
export async function POST(request:Request){try{sameOrigin(request);await revokeSession();const response=result({ok:true});response.headers.set('Set-Cookie',`${sessionCookie}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${process.env.NODE_ENV==='production'?'; Secure':''}`);return response;}catch(error){return failure(error);}}
