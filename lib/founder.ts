import {absoluteUrl} from './seo';
import {founderPortraitPath} from './portrait';

// Keep the same crawlable portrait URL across both founder-related pages.
export const founderPortrait={
  '@type':'ImageObject',
  '@id':absoluteUrl('/bebin-r#portrait'),
  url:absoluteUrl(founderPortraitPath),
  contentUrl:absoluteUrl(founderPortraitPath),
  width:660,
  height:652,
  caption:'Bebin R — Founder & Software Developer at Bebin Tech',
  representativeOfPage:true,
};
