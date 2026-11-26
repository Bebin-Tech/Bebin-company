import type { NextConfig } from "next";

const retiredPortraits=['/founder-profile.jpg','/bebin-r-portrait.png'];
const currentPortrait='/bebin-r-founder.jpg';
const projectHandles=['college-parking','company-management','event-booking','healthwise-ai','placement-app','smart-energy','visitor-management','soil-ai','electricity-usage-analyzer'];
const nextConfig: NextConfig = {
  async redirects(){return [
    {source:"/products",destination:"/services",permanent:true},
    ...projectHandles.map(handle=>({source:`/project-previews/${handle}.svg`,destination:`/project-screenshots/${handle}.png`,permanent:true})),
    ...retiredPortraits.map(source=>({source,destination:currentPortrait,permanent:true})),
    // Replace old optimized-image URLs as well as the original files.
    ...retiredPortraits.map(url=>({source:'/_next/image',has:[{type:'query' as const,key:'url',value:url.replaceAll('.',String.raw`\.`)}],destination:currentPortrait,permanent:true})),
  ];},
  async headers(){return [{source:'/:path*',headers:[
    {key:'X-Content-Type-Options',value:'nosniff'},
    {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
    {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},
    {key:'Content-Security-Policy',value:"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self' https://chatgpt.com https://*.chatgpt.com https://*.chatgpt.site"},
  ]},...['/admin/:path*','/api/:path*'].map(source=>({source,headers:[{key:'X-Robots-Tag',value:'noindex, nofollow, nosnippet'}]}))];},
};

export default nextConfig;
