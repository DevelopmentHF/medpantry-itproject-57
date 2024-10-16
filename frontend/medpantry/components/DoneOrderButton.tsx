'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { useState } from 'react'; 

type DoneOrderButtonProps = {
  orderNumber: string;
};

export default function DoneOrderButton({ orderNumber }: DoneOrderButtonProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string>("");

  const handleClick = async () => {
    setMessage(""); // Clear previous error
    try {
        setMessage("Loading..."); // Show loading message

        const res = await fetch(`/api/HandleOrderAccept`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderNumber }), // Send orderNumber in the body
        });

        if (!res.ok) throw new Error('Network response was not ok');

        // Jump back to current-orders page
        const done = encodeURIComponent(orderNumber);
        router.push(`/protected/current-orders?completedOrder=${done}`);

    } catch (error) {
        console.error('Error during proposing change to manager log:', error);
        setMessage("Failed to accept order");
    }
};

  return (
    <Popover>
      <PopoverTrigger>
        <Button onClick={handleClick} className="bg-red-600 text-white p-2">
          Done
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div>{message}</div>
      </PopoverContent>
    </Popover>
  );
}