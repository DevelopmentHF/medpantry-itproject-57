import React from 'react';
import AuthButton from '@/components/AuthButton';
import OverviewCard from '@/components/OverviewCard';
import { Package, ClipboardCheck, ScanQrCode, Users } from 'lucide-react';
import WarehouseOverview from '@/components/WarehouseOverview';

export default async function Dashboard() {

  // Calculate the number of pending orders. 
  let numOrders: number;
  // Fetch all orders from Shopify
  try {
    // Force a fresh fetch by passing timestamp
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/ShopifyOrders?timestamp=${Date.now()}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    if (!res.ok) throw new Error('Network response was not ok');
    const orderString = await res.json();
    numOrders = Object.keys(orderString).length;

    // Validate the fetched data
    if (!Array.isArray(orderString)) {
      throw new Error('Fetched data is not an array');
    }

  } catch (error) {
    console.error("Error fetching orders:", error);
    return <div>Error fetching orders. Please try again later.</div>;
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