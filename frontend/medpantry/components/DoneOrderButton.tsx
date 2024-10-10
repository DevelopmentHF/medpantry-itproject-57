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
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleClick = async () => {
    setErrorMessage(""); // Clear previous error
    try {
      const value = encodeURIComponent(orderNumber);
      console.log(value);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/HandleOrderAccept?orderNumber=${value}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
    });

      if (!res.ok) throw new Error('Network response was not ok');

      // Jump back to current-orders page
      const done = encodeURIComponent(orderNumber);
      router.push(`/protected/current-orders?completedOrder=${done}`);

    } catch (error) {
      console.error('Error during proposing change to manager log:', error);
      setErrorMessage("Failed to accept order");
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
        <div>{errorMessage}</div>
      </PopoverContent>
    </Popover>
  );
}