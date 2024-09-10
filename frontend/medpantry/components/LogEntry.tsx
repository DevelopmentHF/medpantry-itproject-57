import { Button } from "./ui/button";

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
            <p>ID: {id}</p>
            <p>Box: {box}</p>
            <p>SKU: {sku}</p>
            <p>Proposed Quantity: {proposedQuantityToAdd}</p>
            <div className="flex gap-4">
                <Button className="bg-green-500">Accept</Button>
                <Button className="bg-red-500">Reject</Button>
            </div>
        </div>
        </>
    )
}