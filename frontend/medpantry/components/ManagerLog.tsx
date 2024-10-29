import React, { useState } from "react";
import { Button } from "./ui/button";
import dynamic from 'next/dynamic';
import { useZxing } from "react-zxing";
import { useEffect } from "react";
import LogEntry from "./LogEntry";


interface props {
    
}

export default async function ManagerLog({} : props) {


    let logEntries: any[] = [];

    const apiKey = process.env.NEXT_PUBLIC_API_KEY

    // Throw an error if API_KEY is not defined
    if (!apiKey) {
        console.error('API key is not defined');
        throw new Error('API Key was not ok');
    }

    try {
        // NEED A .env see discord
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/logEntries?timestamp=${Date.now()}`, {
            headers: {
                'API-Key': apiKey, // Include the API key in the headers
            },
        }
);
        if (!res.ok) throw new Error('Network response was not ok');
        logEntries = await res.json();
        console.log(logEntries);
        logEntries = logEntries.filter((entry) => entry.pending);
        console.log(logEntries);
      } catch (error) {
        console.error(error);
        return null;
      }

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