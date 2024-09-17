'use client';
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

export default function LogEntry({ id, box, sku, proposedQuantityToAdd }: LogEntryProps) {

    const handleAccept = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/resolveChange?id=${id}&accepted=true`, {
                method: 'PATCH',
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
            if (!res.ok) throw new Error('Network response was not ok');
        } catch (error) {
            console.error('Error in accepting:', error);
        }
    };

    const handleReject = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/resolveChange?id=${id}&accepted=false`, {
                method: 'PATCH',
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
            if (!res.ok) throw new Error('Network response was not ok');
        } catch (error) {
            console.error('Error in rejecting:', error);
        }
    };

    return (
        <div className="bg-secondary border-solid border-border rounded-md p-4 flex flex-col gap-2">
            <h1 className="font-bold text-xl">Stock Update</h1>

            <div className="flex justify-between">
                <p>Baxter Box</p>
                <p className="text-gray-400">#{box}</p>
            </div>

            <div className="flex justify-between">
                <p>Product</p>
                <p className="text-gray-400">#{sku}</p>
            </div>

            <div className="flex justify-between">
                <p>Quantity</p>
                <p className="text-gray-400">+{proposedQuantityToAdd}</p>
            </div>

            <Separator />

            <div className="flex gap-4">
                <Button className="bg-green-500" onClick={handleAccept}>Accept</Button>
                <Button className="bg-red-500" onClick={handleReject}>Reject</Button>
            </div>
        </div>
    );
}