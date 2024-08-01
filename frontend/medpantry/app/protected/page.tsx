import DeployButton from "@/components/DeployButton";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import FetchDataSteps from "@/components/tutorial/FetchDataSteps";
import Header from "@/components/Header";
import { redirect } from "next/navigation";

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
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
            {/* <DeployButton /> */}

            <AuthButton />
          </div>
        </nav>
      <h1>Medical Pantry Inventory Management</h1>
      <pre>{JSON.stringify(test_table, null, 2)}</pre>

    </div>
  );
}
