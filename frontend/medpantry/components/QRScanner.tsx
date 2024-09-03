"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import dynamic from 'next/dynamic';
import { useZxing } from "react-zxing";
import { BrowserQRCodeReader } from "@zxing/browser";

// interface QrScannerProps {
//     onSkuChange?: Function
// }

export default function QRScanner() {

    const [extractedSku, setExtractedSku] = useState('');
    const [result, setResult] = useState("");

    const { ref } = useZxing({
        onDecodeResult(result) {
        setResult(result.getText());
        },
    });

    return (
        <>
        <video ref={ref} />
        <p>
            <span>Last result:</span>
            <span>{result}</span>
        </p>
        </>
    )
}