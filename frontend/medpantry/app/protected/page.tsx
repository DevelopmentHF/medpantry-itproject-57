import DeployButton from "@/components/DeployButton";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import FetchDataSteps from "@/components/tutorial/FetchDataSteps";
import Header from "@/components/Header";
import Sidebar from "@/components/sidebar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Card from "@/components/card";
import { notFound, redirect } from "next/navigation";

type BaxterBox = {
  id: number;
  sku: string;
  warehouseId: number;
};

// This is a server component
export default async function ProtectedPage() {
  const supabase = createClient();
  
  // Fetch BaxterBox data
  // set link to localhost:8080 in .env -> when we release we swap to actual server link
  const res = await fetch(`${process.env.BACKEND_LINK}/baxterbox?id=2`);
  const box: BaxterBox = await res.json();

  // Authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
    return null;
  }

  // Fetch data from Supabase
  const { data: test_table, error } = await supabase
    .from('test_table')
    .select('*');
  
  if (error) {
    console.error(error);
    // Handle the error accordingly
    notFound();
    return null;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 items-center p-6">
      <nav className="flex gap-4 border-b border-b-foreground/10 h-16 w-full items-center">
        <Input placeholder="Search" />
        <AuthButton />
      </nav>

      <div className="flex flex-col gap-4 w-full">
        <h1 className="font-bold text-4xl justify-start">Backend API Connection Test</h1>
        {/* <Separator /> */}
        {/* <pre>{JSON.stringify(test_table, null, 2)}</pre> */}
        <p>http://localhost:8080/baxterbox?id=2</p>
        <p>Box id: {box.id}</p>
        <p>Box sku: {box.sku}</p>
        <p>Box warehouse number: {box.warehouseId}</p>
      </div>
    </div>
  );
}