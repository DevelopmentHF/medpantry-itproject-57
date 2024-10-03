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

    try {
        // NEED A .env see discord
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/logEntries`);
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
        <>
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
        </>
    )
}