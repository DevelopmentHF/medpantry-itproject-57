import DeployButton from "@/components/DeployButton";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import FetchDataSteps from "@/components/tutorial/FetchDataSteps";
import Header from "@/components/Header";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Card from "@/components/card";




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
  
        {/* <pre>{JSON.stringify(test_table, null, 2)}</pre> */}
      </div>

      <div className="flex flex-wrap gap-4 w-full bg-zinc-700 p-4 rounded-xl">
        <Card title="Needles" bgColor="bg-secondary" quantity="5" sku="494"></Card>
        <Card title="Masks" bgColor="bg-secondary" quantity="400" sku="201"></Card>
        <Card title="Syringes" bgColor="bg-secondary" quantity="72" sku="13"></Card>
        <Card title="Gloves" bgColor="bg-secondary" quantity="150" sku="874"></Card>
        <Card title="Bandages" bgColor="bg-secondary" quantity="250" sku="367"></Card>
        <Card title="Thermometers" bgColor="bg-secondary" quantity="34" sku="652"></Card>
        <Card title="IV Bags" bgColor="bg-secondary" quantity="20" sku="432"></Card>
        <Card title="Scalpels" bgColor="bg-secondary" quantity="60" sku="719"></Card>
        <Card title="Gauze Pads" bgColor="bg-secondary" quantity="300" sku="985"></Card>
        <Card title="Face Shields" bgColor="bg-secondary" quantity="100" sku="111"></Card>
    </div>
  
    </div>
  );
}
