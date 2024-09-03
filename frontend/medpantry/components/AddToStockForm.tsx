"use client"; // Ensures this component is client-side

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AddToStockForm() {
    const [sku, setSku] = useState('');
    const [unitsPacked, setUnitsPacked] = useState('');

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

            setSku('');
            setUnitsPacked('');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
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
    );
}