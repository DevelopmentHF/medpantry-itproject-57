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

interface NewBoxProps {
    box: BaxterBox | null;
}

export default function NewBox({ box }: NewBoxProps) {
    const [unitsPacked, setUnitsPacked] = useState('');

    const handleBoxSubmit = async (event: React.FormEvent, units: number) => {
        event.preventDefault();
        try {
            // Directly use the current full status of the box
            const fullStatusParam = `&fullStatusChangedTo=${box?.full}`;

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/proposeChange?box=${box?.id}&sku=${box?.sku}&proposedQuantityToAdd=${units}${fullStatusParam}`, {
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
    };

    return (
        <>
            {box && (
                <div className="flex gap-4">
                    <BaxterBox
                        id={box.id}
                        sku={box.sku}
                        warehouseId={box.warehouseId}
                        units={box.units}
                        isFull={box.full}
                    />
                    <div className='flex flex-col gap-4'>
                        <form onSubmit={(e) => handleBoxSubmit(e, Number(unitsPacked))} className="flex flex-col gap-4">
                            <Input
                                placeholder="How many units packed?"
                                value={unitsPacked}
                                onChange={(e) => setUnitsPacked(e.target.value)}
                            />
                            <Button type="submit">Update Stock</Button>
                        </form>
                        <Button onClick={() => console.log('Full status:', box.full)}>
                            Full? {box.full ? 'Yes' : 'No'}
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
