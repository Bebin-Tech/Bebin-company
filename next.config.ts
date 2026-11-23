import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects(){return [{source:"/products",destination:"/services",permanent:true}];},
  async headers(){return [{source:'/:path*',headers:[
    {key:'X-Content-Type-Options',value:'nosniff'},
    {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
    {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},
    {key:'Content-Security-Policy',value:"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self' https://chatgpt.com https://*.chatgpt.com https://*.chatgpt.site"},
  ]},...['/admin/:path*','/api/:path*'].map(source=>({source,headers:[{key:'X-Robots-Tag',value:'noindex, nofollow, nosnippet'}]}))];},
};

export default nextConfig;
