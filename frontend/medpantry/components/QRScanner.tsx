"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import dynamic from 'next/dynamic';
import { useZxing } from "react-zxing";
import { useEffect } from "react";

interface QrScannerProps {
    onSkuChange: Function
}

export default function QRScanner({onSkuChange} : QrScannerProps) {

    const [extractedSku, setExtractedSku] = useState('');
    const [result, setResult] = useState("");

    const { ref } = useZxing({
        onDecodeResult(result) {
        setResult(result.getText());
        },
    });

    // when result changes -> extract the sku
    useEffect(() => {
        const fetchSkuData = async () => {
          if (result) {
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/linkToSku?link=${result}`);
              const data = await response.json();
              console.log(data);
              setExtractedSku(data); 
            } catch (error) {
                console.error("Error fetching SKU data:", error);
            }
          }
        };
    
        fetchSkuData();
      }, [result]); // dependent on when result changes

    useEffect(() => {
        onSkuChange(extractedSku);
    }, [extractedSku]);

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