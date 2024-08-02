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

      <div className="flex justify-between w-full gap-4">
        <div className="bg-secondary rounded-md p-4 w-1/3 flex flex-col">
            <h1 className="text-xl font-bold">Stock Levels</h1>
            <div className="flex justify-between">
              <p className="text-muted-foreground">437/502</p>
              <p className="text-muted-foreground">87.05%</p>
            </div>
        </div>
        <div className="bg-secondary rounded-md p-4 w-1/3 flex flex-col">
            <h1 className="text-xl font-bold">Orders yet to pack</h1>
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-muted-foreground">3x Needles</p>
                  <p className="text-muted-foreground">2x Gloves</p>
                </div>
                <p className="text-muted-foreground">#34920</p>
              </div>
              
              <div className="flex justify-between">
                <div>
                  <p className="text-muted-foreground">1x Bandages</p>
                  <p className="text-muted-foreground">7x Scalpels</p>
                  <p className="text-muted-foreground">2x IV Bags</p>
                </div>
                <p className="text-muted-foreground">#83929</p>
              </div>
        </div>
        <div className="bg-secondary rounded-md p-4 w-1/3 flex flex-col">
          <h1 className="text-xl font-bold">Activity</h1>
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-muted-foreground">Received 50x Needles</p>
              <p className="text-muted-foreground">Shipped 10x Gloves</p>
            </div>
            <p className="text-muted-foreground">08:45 AM</p>
          </div>
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-muted-foreground">Packed 20x Bandages</p>
              <p className="text-muted-foreground">Received 30x Scalpels</p>
            </div>
            <p className="text-muted-foreground">09:30 AM</p>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-muted-foreground">Updated stock for IV Bags</p>
              <p className="text-muted-foreground">Received 5x Syringes</p>
            </div>
            <p className="text-muted-foreground">10:15 AM</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <h1 className="font-bold text-4xl justify-start">Inventory</h1>
      </div>

      <div className="flex flex-wrap gap-4 w-full bg-secondary p-4 rounded-xl">
        <Card title="Needles" bgColor="bg-zinc-700" quantity="5" sku="494"></Card>
        <Card title="Masks" bgColor="bg-zinc-700" quantity="400" sku="201"></Card>
        <Card title="Syringes" bgColor="bg-zinc-700" quantity="72" sku="13"></Card>
        <Card title="Gloves" bgColor="bg-zinc-700" quantity="150" sku="874"></Card>
        <Card title="Bandages" bgColor="bg-zinc-700" quantity="250" sku="367"></Card>
        <Card title="Thermometers" bgColor="bg-zinc-700" quantity="34" sku="652"></Card>
        <Card title="IV Bags" bgColor="bg-zinc-700" quantity="20" sku="432"></Card>
        <Card title="Scalpels" bgColor="bg-zinc-700" quantity="60" sku="719"></Card>
        <Card title="Gauze Pads" bgColor="bg-zinc-700" quantity="300" sku="985"></Card>
        <Card title="Face Shields" bgColor="bg-zinc-700" quantity="100" sku="111"></Card>
    </div>
  
    </div>
  );
}
