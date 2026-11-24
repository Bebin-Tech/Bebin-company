export const founderPortraitPath='/bebin-r-founder.jpg';
const retiredPaths=new Set(['/founder-profile.jpg','/bebin-r-portrait.png','/images/bebin-r.png','/images/bebin.jpg','/images/avatar.jpg','/images/profile.png']);
const ownedHosts=new Set(['bebin-tech-projects.vercel.app','bebin-tech.vercel.app']);

// Normalize retired portraits (including old absolute/versioned URLs), while
// preserving future administrator photo uploads and unrelated image URLs.
export function aboutPortraitPath(configured:string){
  if(!configured)return founderPortraitPath;
  try {
    const url=new URL(configured,'https://bebin-tech-projects.vercel.app');
    if(ownedHosts.has(url.hostname)&&retiredPaths.has(url.pathname))return founderPortraitPath;
  } catch {}
  return configured;
}
