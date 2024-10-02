"use client";

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthButton from '@/components/AuthButton';
import AddToStockForm from '@/components/AddToStockForm';
import QRScanner from '@/components/QRScanner';
import BaxterBox from './BaxterBox';
import NewBox from './NewBox';
import { useState } from 'react';


export default function AddStock() {

    type BaxterBox = {
        id: number;
        sku: string;
        warehouseId: number;
        units: number;
        full: boolean;
    };

    const [sku, setSku] = useState('');

    const handleSkuChange = (value: string) => {
        setSku(value);
    };

    const [newBox, setNewBox] = useState<BaxterBox | null>(null);

    const handleCreateNewBox = () => {
        setNewBox({
            id: 50,  // placehoder
            sku: sku,
            warehouseId: 1,  // warehouse id always 1 atm
            units: 0,  // No units packed initially
            full: false,  // not full by default
        });
    };


    return (
        <>
            <QRScanner onSkuChange={handleSkuChange}></QRScanner>
            <AddToStockForm extractedSku={sku}/>
            <Button onClick={handleCreateNewBox}>Create new box?</Button>

            {/* Render the new box if it exists */}
            {newBox && (
                <NewBox box={newBox}></NewBox>
            )}
        </>
    )
}
