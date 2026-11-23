export const maxDuration=10;
export const dynamic = 'force-dynamic';

// Liveness only: no database, Shopify, SMTP or storage operation per probe.
// A 200 here does not claim those dependencies are healthy.
export function GET() {
  return Response.json({status: 'ok'}, {headers: {
    'Cache-Control': 'private, no-store',
    'X-Content-Type-Options': 'nosniff',
  }});
}
