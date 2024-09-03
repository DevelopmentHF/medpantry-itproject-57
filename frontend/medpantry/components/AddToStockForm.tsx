"use client"; // Ensures this component is client-side

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import BaxterBox from './BaxterBox';

type BaxterBox = {
    id: number;
    sku: string;
    warehouseId: number;
    units: number;
    full: boolean;
  };

export default function AddToStockForm() {
    const [sku, setSku] = useState('');
    const [unitsPacked, setUnitsPacked] = useState('');

    const [box, setBox] = useState<BaxterBox | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log('SKU to add:', sku);
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/addToBaxterBox?SKU=${sku}&units=${unitsPacked}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Success:', result);

            try {
                // NEED A .env see discord
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/baxterbox?sku=${sku}`);
                if (!res.ok) throw new Error('Network response was not ok');
                const fetchedBox: BaxterBox = await res.json();
                console.log(fetchedBox);
                setBox(fetchedBox); // Update state with fetched data
              } catch (error) {
                console.error(error);
                return null;
              }

            setSku('');
            setUnitsPacked('');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
                placeholder="Enter SKU to add"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
            />
            <Input
                placeholder='How many units packed?'
                value={unitsPacked}
                onChange={(e) => setUnitsPacked(e.target.value)}
            />
            <Button type="submit">Add to Stock</Button>
        </form>
        {box ? (
            <BaxterBox id={box.id} sku={box.sku} warehouseId={box.warehouseId} units={box.units} isFull={box.full}/>
          ) : (
            <p>No BaxterBox data found.</p>
          )}
        </>
        
    );
}