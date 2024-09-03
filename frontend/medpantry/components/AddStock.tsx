"use client";

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthButton from '@/components/AuthButton';
import AddToStockForm from '@/components/AddToStockForm';
import QRScanner from '@/components/QRScanner';
import { useState } from 'react';


export default function AddStock() {

    const [sku, setSku] = useState('');

    const handleSkuChange = (value: string) => {
        setSku(value);
    };


    return (
        <>
            <QRScanner onSkuChange={handleSkuChange}></QRScanner>
            <AddToStockForm extractedSku={sku}/>
        </>
    )
}
