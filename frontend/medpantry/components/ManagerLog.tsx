'use client'

import React, { useState } from "react";
import { Button } from "./ui/button";
import dynamic from 'next/dynamic';
import { useZxing } from "react-zxing";
import { useEffect } from "react";
import LogEntry from "./LogEntry";

interface props{

}

interface logEntryProps {
    id: number,
    box: number,
    sku: string,
    proposedQuantityToAdd: number,
    pending: boolean,
    accepted: boolean,
    fullStatusChangedTo: boolean
}

export default function ManagerLog({} : props) {

    const [logEntries, setLogEntries] = useState<logEntryProps[]>([]);

    const apiKey = process.env.NEXT_PUBLIC_API_KEY

    // Throw an error if API_KEY is not defined
    if (!apiKey) {
        console.error('API key is not defined');
        throw new Error('API Key was not ok');
    }

    useEffect(() => {
        const fetchLogEntries = async() => {
            try {
                // NEED A .env see discord
                const res = await fetch(`/api/logEntries?timestamp=${Date.now()}`, {
                    headers: {
                        'API-Key': apiKey, // Include the API key in the headers
                    },
                });
                if (!res.ok) throw new Error('Network response was not ok');
                setLogEntries(await res.json());
            } catch (error) {
                console.error(error);
                return null;
            }
        };
        
        fetchLogEntries();
    }, []);
    

      return (
        <div className="flex flex-col gap-4">
            {logEntries.length > 0 ? (
                logEntries
                    .map((entry) => (
                        <LogEntry
                            key={entry.id}
                            id={entry.id}
                            box={entry.box}
                            sku={entry.sku}
                            proposedQuantityToAdd={entry.proposedQuantityToAdd}
                            pending={entry.pending}
                            accepted={entry.accepted}
                            fullStatusChangedTo={entry.fullStatusChangedTo}
                        />
                    ))
            ) : (
                <p>No log entries found.</p>
            )}
        </div>
    )
}