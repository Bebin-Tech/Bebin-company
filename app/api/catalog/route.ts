import {publicData,failure} from '@/lib/server';
export const dynamic='force-dynamic';
export async function GET(){try{return Response.json(await publicData(),{headers:{'Cache-Control':'public, max-age=0, s-maxage=60, stale-while-revalidate=300','X-Content-Type-Options':'nosniff'}});}catch(error){return failure(error);}}
