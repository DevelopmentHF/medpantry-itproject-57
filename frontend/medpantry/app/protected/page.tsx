import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import BaxterBox from "@/components/BaxterBox";
import { Input } from "@/components/ui/input";
import AuthButton from "@/components/AuthButton";
import { Button } from "@/components/ui/button";

type BaxterBox = {
  id: number;
  sku: string;
  warehouseId: number;
  units: number;
  full: boolean;
};

export default async function ProtectedPage({ searchParams }: { searchParams: { id?: string } }) {
  const supabase = createClient();

  // Authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
    return null;
  }

  // Fetch BaxterBox data if ID is provided
  let box: BaxterBox | null = null;
  const boxId = searchParams.id ? parseInt(searchParams.id, 10) : null;
  
  if (boxId) {
    try {
      // NEED A .env see discord
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/baxterbox?id=${boxId}`);
      if (!res.ok) throw new Error('Network response was not ok');
      box = await res.json();
      console.log(box)
    } catch (error) {
      console.error(error);
      notFound();
      return null;
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 items-center p-6">
      <nav className="flex gap-4 border-b border-b-foreground/10 h-16 w-full items-center">
        <AuthButton />
        <a href="protected/dashboard">
          Dashboard
        </a>
        <a href="protected/add-to-stock">
          Go to Add to Stock
        </a>
      </nav>

      <div className="flex flex-col gap-4 w-full">
        <h1 className="font-bold text-4xl justify-start">Backend API Connection Test</h1>
        <form action="" method="get" className="flex gap-2">
          <Input name="id" placeholder="Enter BaxterBox ID" defaultValue={searchParams.id || ''} />
          <button type="submit" className="btn-primary">Fetch</button>
        </form>
        {box ? (
          <BaxterBox id={box.id} sku={box.sku} warehouseId={box.warehouseId} units={box.units} isFull={box.full}/>
        ) : (
          <p>No BaxterBox data found.</p>
        )}
      </div>
    </div>
  );
}