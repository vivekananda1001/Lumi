import { getServerSession } from "next-auth";
import { authOption, CustomSession } from "./api/auth/[...nextauth]/options";
import LoginModal from "@/components/auth/LoginModal";
import { redirect } from "next/navigation";

export default async function Home() {
  const session:CustomSession | null = await getServerSession(authOption);
  const user = session?.user;

  return (
    <div className="min-h-screen flex flex-col">
      {!user ? (
        <LoginModal />
      ) : (
        redirect("/dashboard")
      )}      
    </div>
  );
}
