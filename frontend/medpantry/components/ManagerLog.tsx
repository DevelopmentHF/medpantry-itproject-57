import React, { useState } from "react";
import { Button } from "./ui/button";
import dynamic from 'next/dynamic';
import { useZxing } from "react-zxing";
import { useEffect } from "react";
import LogEntry from "./LogEntry";


interface props {
    logEntries: any[];
    isManagerAccount: boolean;
}

export default function ManagerLog({logEntries, isManagerAccount} : props) {

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
                            isManagerAccount={isManagerAccount}
                        />
                    ))
            ) : (
                <p>No log entries found.</p>
            )}
        </>
    )
}