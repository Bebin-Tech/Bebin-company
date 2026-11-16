import {absoluteUrl} from './seo';

// Keep the same crawlable portrait URL across both founder-related pages.
export const founderPortrait={
  '@type':'ImageObject',
  '@id':absoluteUrl('/bebin-r#portrait'),
  url:absoluteUrl('/founder-profile.jpg'),
  contentUrl:absoluteUrl('/founder-profile.jpg'),
  width:460,
  height:460,
  caption:'Bebin R — Founder & Software Developer at Bebin Tech',
  representativeOfPage:true,
};
