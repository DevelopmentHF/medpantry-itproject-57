import React from 'react';
import AuthButton from '@/components/AuthButton';
import OverviewCard from '@/components/OverviewCard';
import { Package, ClipboardCheck, ScanQrCode, Users } from 'lucide-react';
import WarehouseOverview from '@/components/WarehouseOverview';
// import { promises as fs } from 'fs';
// import path from 'path';

interface OrderStringType {
  sku: string[];
  quantity: number[];
  id: string;
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

//const completedOrdersCsvFilePath = path.join(process.cwd(), 'completed_orders.csv');

// async function updateCompletedOrdersCsv(orderString: OrderStringType[], completedOrders: string[]) {
//   const validOrderNumbers = new Set(orderString.map(entry => entry.orderNumber));
//   const updatedOrders = completedOrders.filter(orderNumber => !validOrderNumbers.has(orderNumber));
//   await fs.writeFile(completedOrdersCsvFilePath, updatedOrders.join(',') + (updatedOrders.length > 0 ? ', ' : ''));
// }

let numOrders: number;
export default async function Dashboard() {

  const apiKey = process.env.NEXT_PUBLIC_API_KEY

  // Throw an error if API_KEY is not defined
  if (!apiKey) {
      console.error('API key is not defined');
      throw new Error('API Key was not ok'); 
  }

  //const CSVdata = await fs.readFile(completedOrdersCsvFilePath, 'utf-8');
  //const completedOrders: string[] = CSVdata.split(',').map(entry => entry.trim()).filter(entry => entry.length > 0);

  // Fetch all orders from Shopify
  let orderArray: OrderProps[] = [];
  try {
    console.log("Fetching orders from Shopify...");

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/ShopifyOrders?timestamp=${Date.now()}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'API-Key': apiKey,
      },
    });

    if (!res.ok) {
      console.error(`Error fetching orders. Status: ${res.status}`);
      throw new Error('Network response was not ok');
    }

    // No need to manually parse the response text unless it fails
    let orderString: OrderStringType[] = await res.json();
    console.log(orderString)

    if (!Array.isArray(orderString) || orderString.length === 0) {
      console.warn("No orders received from backend.");
    } else {
      orderArray = orderString.map((order) => ({
        orderNumber: order.orderNumber,
        datas: order.sku.map((sku, index) => ({
          itemName: order.itemName[index],
          quantity: order.quantity[index],
        })),
      }));
      numOrders = orderArray.length;
      console.log(`Fetched ${numOrders} orders successfully.`);
    }

  } catch (error) {
    console.error("Error fetching orders:", error);
    return <div>Error fetching orders.</div>;
  }

  let numStockUpdates: number;
  try {
    // NEED A .env see discord
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/logEntries?timestamp=${Date.now()}`, {
      headers: {
          'API-Key': apiKey, // Include the API key in the headers
      },
  });
    if (!res.ok) throw new Error('Network response was not ok');
    let logEntries: any[] = await res.json();
    logEntries = logEntries.filter((entry) => entry.pending);
    numStockUpdates = logEntries.length;
  } catch (error) {
    console.error(error);
    return null;
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
            title="Orders"
            count={numOrders}
            description="Pending orders"
          />
        </a>
        <a href="protected/manager-log">
          <OverviewCard
            icon={<ClipboardCheck />}
            title="Updates"
            count={numStockUpdates}
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