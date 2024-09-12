import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface LogEntryProps {
    id: number;
    box: number;
    sku: string;
    proposedQuantityToAdd: number;
    pending: boolean;
    accepted: boolean;
  }


export default function LogEntry({ id, box, sku, proposedQuantityToAdd, pending, accepted } : LogEntryProps) {
    return (
        <>
            <div className={`bg-secondary border-solid border-border rounded-md p-4 flex flex-col gap-2`}>

                <h1 className="font-bold text-xl">Stock Update</h1>

                <div className="flex justify-between">
                    <p className="">Baxter Box</p>
                    <p className="text-gray-400">#{box}</p>
                </div>
                
                <div className="flex justify-between">
                    <p className="">Product</p>
                    <p className="text-gray-400">#{sku}</p>
                </div>
                
                <div className="flex justify-between">
                    <p className="">Quantity</p>
                    <p className="text-gray-400">+{proposedQuantityToAdd}</p>
                </div>

                <Separator />

                <div className="flex gap-4">
                    <Button className="bg-green-500">Accept</Button>
                    <Button className="bg-red-500">Reject</Button>
                </div>
            </div>
        </>
    )
}