import { publicData, result, failure } from '@/lib/server';
export const dynamic='force-dynamic';
export async function GET(){try{return result(await publicData());}catch(error){return failure(error);}}
