import {Admin} from '@/components/admin';
import {softwareProjects} from '@/lib/shopify';
import {AdminLogin} from '@/components/admin-login';
import {getAdminUser} from '@/lib/auth';
import './admin.css';
export const dynamic='force-dynamic';
export const metadata={title:'Admin Dashboard',robots:{index:false,follow:false}};
export default async function Page(){const user=await getAdminUser();if(!user)return <AdminLogin/>;const projects=await softwareProjects().catch(()=>null);return <Admin name={user.displayName} email={user.email} storeCount={projects?.length}/>;}
