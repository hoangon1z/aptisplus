import {currentUser} from "@/lib/server/auth";
import {notFound} from "next/navigation";
export default async function AdminLayout({children}:{children:React.ReactNode}){const user=await currentUser();if(user?.role!=="admin")notFound();return children}