"use client"

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import AuthButton from './AuthButton';
import { Separator } from './ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type BaxterBox = {
    id: number;
    sku: string;
    warehouseId: number;
    units: number;
    full: boolean;
};

export default function WarehouseOverview() {
    const [boxes, setBoxes] = useState<BaxterBox[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBoxes() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/baxterbox`);
                if (!res.ok) throw new Error('Network response was not ok');
                const fetchedBoxes: BaxterBox[] = await res.json();
                setBoxes(fetchedBoxes);
            } catch (error) {
                console.error('Failed to fetch BaxterBox data:', error);
                setError('Failed to fetch data. Please try again later.');
            }
        }
        fetchBoxes();
    }, []); // Empty dependency array to run effect once on mount

    if (error) {
        return <div>{error}</div>;
    }

    // Create a grid of 800 boxes, with existing boxes filled in
    const totalBoxes = 800;
    const gridBoxes = Array.from({ length: totalBoxes }, (_, index) => {
        const box = boxes.find(b => b.id === index + 1); // Assuming IDs start at 1
        return box || null; // Return the box or null if not found
    });

    const getBoxColor = (box: BaxterBox | null) => {
        if (!box) return 'bg-gray-300'; // empty
        if (box.full) return 'bg-red-700'; // full
        return 'bg-red-300'; // partially filled
    };

    return (
        <TooltipProvider>
            <>
                <h1 className="text-2xl font-bold">Warehouse Overview</h1>
                {error ? (
                    <div>{error}</div>
                ) : (
                    <div
                        className="
                            grid gap-1 
                            grid-cols-[repeat(12,minmax(0,1fr))] 
                            sm:grid-cols-[repeat(24,minmax(0,1fr))] 
                            md:grid-cols-[repeat(36,minmax(0,1fr))] 
                            lg:grid-cols-[repeat(48,minmax(0,1fr))] 
                            xl:grid-cols-[repeat(60,minmax(0,1fr))]"
                    >
                        {gridBoxes.map((box, index) => (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    <div
                                        className={`w-4 h-4 cursor-pointer ${getBoxColor(box)} rounded-md transition-transform duration-200 hover:scale-125`}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        {box
                                            ? `Box: ${box.id}, SKU: ${box.sku}, Units: ${box.units}`
                                            : 'Empty'}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                )}
            </>
        </TooltipProvider>
    );
}
