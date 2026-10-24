# Google Search setup

Production URL: https://bebin-tech-projects.vercel.app/

1. Open https://search.google.com/search-console and add a **URL prefix** property for the exact production URL above.
2. Choose the HTML tag verification method. Set the tag's `content` value as the Vercel production environment variable `GOOGLE_SITE_VERIFICATION`, then redeploy. The app renders this value in its Google verification meta tag. Do not paste the entire HTML tag into the variable.
3. Verify ownership in Search Console. Submit `https://bebin-tech-projects.vercel.app/sitemap.xml` under Sitemaps.
4. Use URL Inspection for the homepage and project pages to inspect indexing and request indexing when appropriate. Monitor indexing, search queries, impressions and clicks in Search Console.

Public pages have unique titles/descriptions, canonical URLs and social metadata. Project pages expose actual catalogue prices in Product/Offer structured data and breadcrumbs. Search filter combinations canonicalize to `/projects` and use `noindex, follow`. Admin/API routes carry `X-Robots-Tag: noindex, nofollow, nosnippet` and are excluded from the sitemap; authentication and payment checks remain responsible for access control.

Keep project descriptions accurate and specific, add real screenshots and useful documentation, and earn relevant links from your own legitimate profiles and useful published work. Do not invent reviews or rankings. SEO and structured data do not guarantee indexing, rich results or a first-place Google ranking.

After buying a custom domain, connect it in Vercel, update `NEXT_PUBLIC_SITE_URL` to the preferred HTTPS domain, redirect the old domain consistently, redeploy and verify the new Search Console property. Avoid maintaining duplicate public domains without redirects/canonical URLs.

Verification: `SEO_TEST_URL=https://bebin-tech-projects.vercel.app node tests/seo.mjs` (PowerShell: set `$env:SEO_TEST_URL` before running Node). For a custom domain also update `SEO_CANONICAL_URL`.
