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

    const apiKey = process.env.NEXT_PUBLIC_API_KEY

    // Throw an error if API_KEY is not defined
    if (!apiKey) {
        console.error('API key is not defined');
        throw new Error('API Key was not ok');
    }


    // when result changes -> extract the sku
    useEffect(() => {
        const fetchSkuData = async () => {
          if (result) {
            try {
              const response = await fetch(`/api/linkToSku?link=${result}`, {
                headers: {
                    'API-Key': apiKey, // Include the API key in the headers
                },
            });
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