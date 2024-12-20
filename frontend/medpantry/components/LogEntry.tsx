'use client';
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useRouter } from "next/navigation";

interface LogEntryProps {
    id: number;
    box: number;
    sku: string;
    proposedQuantityToAdd: number;
    pending: boolean;
    accepted: boolean;
    fullStatusChangedTo: boolean;
}

export default function LogEntry({ id, box, sku, proposedQuantityToAdd, fullStatusChangedTo }: LogEntryProps) {

    const router = useRouter();

    const apiKey = process.env.NEXT_PUBLIC_API_KEY

    // Throw an error if API_KEY is not defined
    if (!apiKey) {
        console.error('API key is not defined');
        throw new Error('API Key was not ok');
    }

    const handleAccept = async () => {
        try {
            const res = await fetch(`/api/resolveStockChange?id=${id}&accepted=true`, {
                method: 'PATCH',
                headers: {
                    'Cache-Control': 'no-cache',
                    'API-Key': apiKey,
                },
            });
            if (!res.ok) throw new Error('Network response was not ok');
            router.refresh()
        } catch (error) {
            console.error('Error in accepting:', error);
        }
    };

    const handleReject = async () => {
        try {
            const res = await fetch(`/api/resolveStockChange?id=${id}&accepted=false`, {
                method: 'PATCH',
                headers: {
                    'Cache-Control': 'no-cache',
                    'API-Key': apiKey,
                },
            });
            if (!res.ok) throw new Error('Network response was not ok');
            router.refresh()
        } catch (error) {
            console.error('Error in rejecting:', error);
        }
    };

    return (
        <div className="bg-card-foreground border-solid border-border rounded-md p-4 flex flex-col gap-2 w-full">
            <h1 className="font-bold text-xl">Inventory</h1>

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

            {fullStatusChangedTo !== null && (
                <div className="flex justify-between">
                    <p>Full Status Changed</p>
                    <p className="text-gray-400">{fullStatusChangedTo ? 'True' : 'False'}</p>
                </div>
            )}

            <Separator />

            <div className="flex gap-4 justify-between">
                <Button className="bg-green-500" onClick={handleAccept}>Accept</Button>
                <Button className="bg-red-500" onClick={handleReject}>Reject</Button>
            </div>
        </div>
    );
}
