"use client"; // Ensures this component is client-side

import { useEffect, useState } from 'react';
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

interface AddToStockFormProps {
    extractedSku : string
}

export default function AddToStockForm({extractedSku} : AddToStockFormProps) {
    const [sku, setSku] = useState('');
    const [unitsPacked, setUnitsPacked] = useState('');

    const [boxes, setBoxes] = useState<BaxterBox[] | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log('SKU to add:', sku);
        
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/allBaxterBoxesBySKU?sku=${sku}`);
            if (!res.ok) throw new Error('Network response was not ok');
            const fetchedBoxes: BaxterBox[] = await res.json();
            console.log(fetchedBoxes);
            setBoxes(fetchedBoxes); // Update state with fetched array of boxes
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    useEffect(() => {
        setSku(extractedSku);
    }, [extractedSku]);

    const handleBoxSubmit = async (event: React.FormEvent, units: number, box: number) => {
        event.preventDefault();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/proposeChange?box=${box}&sku=${sku}&proposedQuantityToAdd=${units}`, {
                method: 'POST',
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const result = await response.json();
            console.log('Success:', result);
    
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    return (
        <>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
                placeholder="Enter SKU to add"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
            />
            <Button type="submit">Display Stock</Button>
        </form>
    
        {boxes ? (
            boxes.map((baxterBox) => {
                let localUnitsPacked: number; // Local state for units packed per box
                return (
                    <div key={baxterBox.id} className="flex gap-4">
                        <BaxterBox 
                            id={baxterBox.id} 
                            sku={baxterBox.sku} 
                            warehouseId={baxterBox.warehouseId} 
                            units={baxterBox.units} 
                            isFull={baxterBox.full} 
                        />
                        <form onSubmit={(e) => handleBoxSubmit(e, localUnitsPacked, baxterBox.id)} className="flex flex-col gap-4">
                            <Input
                                placeholder="How many units packed?"
                                onChange={(e) => localUnitsPacked = Number(e.target.value)}
                            />
                            <Button type="submit">Update Stock</Button>
                        </form>
                    </div>
                );
            })
        ) : (
            <p>No BaxterBox data found.</p>
        )}
        </>
    );
}