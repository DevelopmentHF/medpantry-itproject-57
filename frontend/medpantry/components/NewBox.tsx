"use client"; // Ensures this component is client-side

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import BaxterBox from './BaxterBox';
import { Switch } from "@/components/ui/switch"

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

    const apiKey = process.env.NEXT_PUBLIC_API_KEY

    // Throw an error if API_KEY is not defined
    if (!apiKey) {
        console.error('API key is not defined');
        throw new Error('API Key was not ok');
    }

    const handleBoxSubmit = async (event: React.FormEvent, units: number) => {
        event.preventDefault();
        try {
            // Directly use the current full status of the box
            const fullStatusParam = `&fullStatusChangedTo=${box?.full}`;

            const response = await fetch(`/api/proposeStockChange?box=${box?.id}&sku=${box?.sku}&proposedQuantityToAdd=${units}${fullStatusParam}`, {
                method: 'POST',
                headers: {
                  'API-Key': apiKey, // Include the API key in the headers
              },
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
                  <div className='flex gap-4 justify-around'>
                    <p>Full?</p>
                    <Switch
                      checked={!!box.full}
                      onCheckedChange={() => {
                        box.full = !box.full;
                        console.log('Full status toggled:', box.full);
                      }}
                    />
                  </div>
                  <Button type="submit">Update Stock</Button>
                </form>
              </div>
            </div>
          )}
        </>
      );
}
