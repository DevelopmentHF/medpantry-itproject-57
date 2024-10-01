'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

type DoneOrderButtonProps = {
    boxes: number[];
    datas: { quantity: number; sku: string; itemName: string }[]; // Updated type to include itemName
};

export default function DoneOrderButton({ boxes, datas }: DoneOrderButtonProps) {
    const router = useRouter();

    const handleClick = async () => {
        try {
            // Loop through each box and data to propose change to manager log
            for (const box of boxes) {
                for (const data of datas) {
                    console.log(box, data.sku, data.quantity);

                    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/proposeChange?box=${box}&sku=${data.sku}&proposedQuantityToAdd=${data.quantity}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ orderStatus: 'done' }),
                    });

                    if (!res.ok) throw new Error('Network response was not ok');
                    const text = await res.text();
                    console.log(text);

                    //jump back to current-order page
                    if(text === "Successfully logged proposal change") router.push('/protected/current-orders');
                }
            }
        } catch (error) {
            console.error('Error during proposing change to manager log:', error);
        }
    };

    return (
        <Button onClick={handleClick} className="bg-red-600 text-white p-2">
            Done
        </Button>
    );
}
