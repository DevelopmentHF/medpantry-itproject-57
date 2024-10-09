'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

type DoneOrderButtonProps = {
  orderNumber: string
};

export default function DoneOrderButton({ orderNumber }: DoneOrderButtonProps) {
  const router = useRouter();

  const handleClick = async () => {
    try {
      const value: string = encodeURIComponent(orderNumber);
      console.log(value);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/HandleOrderAccept?orderNumber=${value}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderStatus: 'done' }),
      });

      if (!res.ok) throw new Error('Network response was not ok');
      const text = await res.text();
      console.log(text);

      // Jump back to current-order page
      if (text === "Successfully logged proposal change") router.push('/protected/current-orders');

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
