import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthButton from '@/components/AuthButton';
import AddToStockForm from '@/components/AddToStockForm';
import QRScanner from '@/components/QRScanner';
import { useState } from 'react';
import AddStock from '@/components/AddStock';
import ManagerLog from '@/components/ManagerLog';
import Order from "@/components/Order";

import { ClipboardCheck } from 'lucide-react';
import ManagerLogTabs from '@/components/ManagerLogTabs';

interface OrderStringType {
  sku: string[];
  quantity: number[];
  orderNumber: string;
  itemName: string[];
}

interface Data {
  quantity: number;
  sku: string;
  itemName: string;
}

interface OrderProps {
  orderNumber: string;
  datas: Data[];
  boxes?: number[][];
}


export default async function ManagerLogPage() {

    return (
      <div className="flex-1 w-full flex flex-col gap-12 items-center p-6">
        <nav className="flex gap-4 border-b border-b-foreground/10 h-16 w-full items-center justify-between">
          <Button className="hover:bg-slate-200">
            <a href="../protected">Home</a>
          </Button>
          <AuthButton />
        </nav>
        <h1 className="text-3xl font-bold flex items-center">
          <ClipboardCheck className="mr-2 h-6 w-6 text-red-600" />
          Manager Log
        </h1>
        <ManagerLogTabs />
      </div>
    );
}