import 'server-only';
import {revalidatePath, revalidateTag} from 'next/cache';

export const PUBLIC_CONTENT_TAG = 'bebin-public-content-v1';
export const PUBLIC_CATALOGUE_TAG = 'bebin-software-catalogue-v1';
export const PUBLIC_CACHE_SECONDS = 60;

// Only published company/catalogue data belongs in these caches. Orders,
// sessions, payment screenshots, download tokens and approvals never do.
export function invalidatePublicContent() {
  revalidateTag(PUBLIC_CONTENT_TAG, {expire: 0});
  for (const path of ['/', '/about', '/bebin-r', '/services', '/technologies', '/projects', '/contact', '/api/catalog', '/sitemap.xml']) {
    revalidatePath(path);
  }
  revalidatePath('/projects/[id]', 'page');
}
