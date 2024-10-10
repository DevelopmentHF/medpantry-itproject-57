'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {Popover, PopoverTrigger, PopoverContent} from "@nextui-org/popover";
import { useState } from 'react'; 

type DoneOrderButtonProps = {
  orderNumber: string
};

export default function DoneOrderButton({ orderNumber }: DoneOrderButtonProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const handleClick = async () => {
    try {
      const value: string = encodeURIComponent(orderNumber);
      console.log(value);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/HandleOrderAccept?orderNumber=${value}`);

      if (!res.ok) {
        setErrorMessage("Failed to accept order");
        throw new Error('Network response was not ok');
      } 
      const text = await res.text();
      console.log(text);

      // Jump back to current-order page
      if (text === "Successfully logged proposal change") router.push('/protected/current-orders');

    } catch (error) {
      console.error('Error during proposing change to manager log:', error);
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
