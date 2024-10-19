import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthButton from '@/components/AuthButton';
import AddToStockForm from '@/components/AddToStockForm';
import QRScanner from '@/components/QRScanner';
import { useState } from 'react';
import AddStock from '@/components/AddStock';
import ManagerLog from '@/components/ManagerLog';
//import { promises as fs } from 'fs';
// import path from 'path';
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

//const completedOrdersCsvFilePath = path.join(process.cwd(), 'completed_orders.csv');

// async function updateCompletedOrdersCsv(orderString: OrderStringType[], completedOrders: string[]) {
//   const validOrderNumbers = new Set(orderString.map(entry => entry.orderNumber));
//   const updatedOrders = completedOrders.filter(orderNumber => validOrderNumbers.has(orderNumber));
//   await fs.writeFile(completedOrdersCsvFilePath, updatedOrders.join(',') + (updatedOrders.length > 0 ? ', ' : ''));
// }


export default async function ManagerLogPage() {

  // //const CSVdata = await fs.readFile(completedOrdersCsvFilePath, 'utf-8');
  // //const completedOrders: string[] = CSVdata.split(',').map(entry => entry.trim());

  // // Fetch all orders from Shopify
  // let orderArray: OrderProps[] = []; 
  // try {
  //   // Force a fresh fetch by passing timestamp
  //   const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/ShopifyOrders?timestamp=${Date.now()}`, {
  //     method: 'GET',
  //     headers: {
  //       'Cache-Control': 'no-cache',
  //     },
  //   });
  //   if (!res.ok) throw new Error('Network response was not ok');
  //   let orderString: OrderStringType[] = await res.json();
  //   //orderString = orderString.filter((entry) => completedOrders.includes(entry.orderNumber))

  //   //updateCompletedOrdersCsv(orderString, completedOrders);

  //   // Validate the fetched data
  //   if (!Array.isArray(orderString)) {
  //     throw new Error('Fetched data is not an array');
  //   }

  //   // Fill the array of orders and group items by orderNumber. 
  //   // Note that this does not fetch the required Baxter Boxes. This will be handled later. 
  //   const orders = orderString.reduce((acc: Record<string, OrderProps>, item: any) => {

  //     if (!acc[item.orderNumber]) {
  //       acc[item.orderNumber] = {
  //         orderNumber: item.orderNumber,
  //         datas: [],
  //       };
  //     }
  //     for(let i = 0; i < item.sku.length; i ++){
  //       acc[item.orderNumber].datas.push({
  //         quantity: item.quantity[i],
  //         sku: item.sku[i],
  //         itemName: item.itemName[i],
  //       });
  //     }
  //     return acc;
  //   }, {});

  //   orderArray = Object.values(orders) as OrderProps[];

  // } catch (error) {
  //   console.error("Error fetching orders:", error);
  //   return <div>Error fetching orders.</div>;
  // }

  // // Function used later to fetch the Baxter Boxes needed for each order.
  // async function getBoxId(orderNumber: string): Promise<number[][]> {
  //   // Convert # into %23 for /RequiredBaxterBoxes
  //   const value: string = encodeURIComponent(orderNumber);

  //   try {
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/RequiredBaxterBoxes?orderNumber=${value}&timestamp=${Date.now()}`, {
  //       method: 'GET',
  //       headers: {
  //         'Cache-Control': 'no-cache',
  //       },
  //     });

  //     if (!res.ok) throw new Error('Network response was not ok');

  //     const boxes = await res.json();

  //     // Validate the box data structure
  //     if (!Array.isArray(boxes)) {
  //       console.warn('Fetched box data is not an array:', boxes);
  //       return [];
  //     }

  //     return boxes.map((item: any) => item.map((entry: any) => entry.box_id));
  //     //return boxes;
  //   } catch (error) {
  //     console.error("Error fetching box IDs:", error);
  //     return []; 
  //   }
  // }

  // // Prepare orders with their corresponding box IDs
  // const ordersWithBoxIds = await Promise.all(
  //   orderArray.map(async (order) => {
  //     const boxes: number[][] = await getBoxId(order.orderNumber)
  //     return {
  //       ...order,
  //       boxes: boxes || [],
  //     };
  //   })
  // );

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