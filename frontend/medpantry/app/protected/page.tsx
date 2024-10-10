import React from 'react';
import AuthButton from '@/components/AuthButton';
import OverviewCard from '@/components/OverviewCard';
import { Package, ClipboardCheck, ScanQrCode, Users } from 'lucide-react';
import WarehouseOverview from '@/components/WarehouseOverview';
import { promises as fs } from 'fs';
import path from 'path';

interface OrderStringType {
  sku: string[];
  quantity: number[];
  orderNumber: string;
  itemName: string[];
}

interface Data {
	quantity: number;
	itemName: string;
}

interface OrderProps {
	orderNumber: string;
	datas: Data[];
	boxes?: number[];
}

const completedOrdersCsvFilePath = path.join(process.cwd(), 'completed_orders.csv');
let numOrders: number;
export default async function Dashboard() {

  const data = await fs.readFile(completedOrdersCsvFilePath, 'utf-8');
  const completedOrders: string[] = data.split(',').map(entry => entry.trim());

  // Fetch all orders from Shopify
  let orderArray: OrderProps[] = []; 
  try {
    // Force a fresh fetch by passing timestamp
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/ShopifyOrders?timestamp=${Date.now()}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    if (!res.ok) throw new Error('Network response was not ok');
    let orderString: OrderStringType[] = await res.json();
    orderString = orderString.filter((entry) => !completedOrders.includes(entry.orderNumber))
    console.log(orderString);

    numOrders = Object.keys(orderString).length;

  } catch (error) {
    console.error("Error fetching orders:", error);
    return <div>Error fetching orders.</div>;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 items-center p-6">
      <nav className="flex gap-4 border-b border-b-foreground/10 h-16 w-full items-center">
        <div className="ml-auto">
          <AuthButton />
        </div>
      </nav>
      <div className="flex">
        <div className="flex-1 p-6">
          <h1 className="font-bold text-4xl">Medical Pantry Dashboard</h1>
        </div>
      </div>

      <div className="flex w-full">
        <h1 className="text-2xl font-bold">Overview</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 w-full text-black">
        <a href="protected/current-orders">
          <OverviewCard
            icon={<Package />}
            title="Current Orders"
            count={numOrders}
            description="Pending orders"
          />
        </a>
        <a href="protected/manager-log">
          <OverviewCard
            icon={<ClipboardCheck />}
            title="Inventory Updates"
            count={0}
            description="Pending"
          />
        </a>

        <a href="protected/add-to-stock">
          <OverviewCard
            icon = {<ScanQrCode />}
            title="Stock packed"
            count={0}
            description="This week"
          />
        </a>

        <OverviewCard 
          icon= {<Users />} 
          title="People" 
          count={0} 
          description="On warehouse" />
      </div>

      <WarehouseOverview/>

    </div>
  );
}