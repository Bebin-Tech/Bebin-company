export const founderPortraitPath='/bebin-r-founder.jpg';

// Replace the old default portrait while preserving future admin photo uploads.
export function aboutPortraitPath(configured:string){
  const previous=['/founder-profile.jpg','/bebin-r-portrait.png'];
  return !configured || previous.some(path=>configured===path || configured==='https://bebin-tech-projects.vercel.app'+path)
    ? founderPortraitPath : configured;
}
