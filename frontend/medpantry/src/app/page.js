import { Button } from "@/components/ui/button"


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1 className="font-bold text-4xl">Medical Pantry</h1>
      </div>

      <div className="flex gap-5">
        <Button className="text-lg p-10 bg-green-400">Add</Button>
        <Button className="text-lg p-10 bg-yellow-400">Edit</Button>
        <Button className="text-lg p-10 bg-red-400">Delete</Button>
      </div>
    
    </main>
  );
}
