import DeployButton from "@/components/DeployButton";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import FetchDataSteps from "@/components/tutorial/FetchDataSteps";
import Header from "@/components/Header";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"




export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  
let { data: test_table, error } = await supabase
  .from('test_table')
  .select('*')
          


  return (
    <div className="flex-1 w-full flex flex-col gap-12 items-center p-6">

      <nav className="flex gap-4 border-b border-b-foreground/10 h-16 w-full items-center">
        <Input placeholder="Search"></Input>
        <AuthButton></AuthButton>
      </nav>

      <div className="flex flex-col gap-4 w-full">
        <h1 className="font-bold text-4xl justify-start">Overview</h1>

        {/* <Separator></Separator> */}
  
        <pre>{JSON.stringify(test_table, null, 2)}</pre>
      </div>
  
    </div>
  );
}
