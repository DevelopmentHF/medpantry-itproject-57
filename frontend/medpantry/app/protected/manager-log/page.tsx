import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthButton from '@/components/AuthButton';
import AddToStockForm from '@/components/AddToStockForm';
import QRScanner from '@/components/QRScanner';
import { useState } from 'react';
import AddStock from '@/components/AddStock';
import ManagerLog from '@/components/ManagerLog';
import { createClient } from "@/utils/supabase/server";

export default async function ManagerLogPage() {

    let logEntries: any[] = [];

    try {
        // NEED A .env see discord
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/logEntries`);
        if (!res.ok) throw new Error('Network response was not ok');
        logEntries = await res.json();
        logEntries = logEntries.filter((entry) => entry.pending);
        console.log(logEntries);
    } catch (error) {
        console.error(error);
        return null;
    }

    //check if the user is on the manager account
    let isManagerAccount: boolean = false;
    try {
        const { data: { user } } = await createClient().auth.getUser();
        console.log("User:", user.id);  // Check if user data is correct
        // manager account ID is HARDCODED
        if (user?.id === "3915c954-4bfc-439f-8884-320b3d48e083") {
            isManagerAccount = true;
        }
    } catch (error) {
        console.error('Error in checking ID:', error);
    }
    console.log("isManagerAccount: ", isManagerAccount);

    return (
        <div className="flex-1 w-full flex flex-col gap-12 items-center p-6">
            <nav className="flex gap-4 border-b border-b-foreground/10 h-16 w-full items-center justify-between">

                <Button>
                    <a href="../protected">
                        Home
                    </a>
                </Button>

                <AuthButton />
            </nav>
            <h1 className="font-bold text-4xl">Manager Log</h1>
            <ManagerLog logEntries={logEntries} isManagerAccount={isManagerAccount}></ManagerLog>
        </div>
    );
}