import {currentUser} from "@/lib/server/auth";
import {redirect} from "next/navigation";
export default async function ExamLayout({children}:{children:React.ReactNode}){if(!await currentUser())redirect("/login");return children}