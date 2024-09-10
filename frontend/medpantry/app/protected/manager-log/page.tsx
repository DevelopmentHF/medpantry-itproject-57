import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthButton from '@/components/AuthButton';
import AddToStockForm from '@/components/AddToStockForm';
import QRScanner from '@/components/QRScanner';
import { useState } from 'react';
import AddStock from '@/components/AddStock';

export default function ManagerLogPage() {

    return (
        <div className="flex-1 w-full flex flex-col gap-12 items-center p-6">
            <nav className="flex gap-4 border-b border-b-foreground/10 h-16 w-full items-center">
                <AuthButton />
                <a href="../protected">
                    Go back
                </a>
            </nav>
            <h1 className="font-bold text-4xl">Manager Log</h1>
        </div>
    );
}