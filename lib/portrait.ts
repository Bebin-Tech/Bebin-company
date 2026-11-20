export const portfolioPortraitPath='/bebin-r-portrait.png';

// Replace the old default portrait while preserving future admin photo uploads.
export function aboutPortraitPath(configured:string){
  return !configured || configured==='/founder-profile.jpg' || configured==='https://bebin-tech-projects.vercel.app/founder-profile.jpg'
    ? portfolioPortraitPath : configured;
}
