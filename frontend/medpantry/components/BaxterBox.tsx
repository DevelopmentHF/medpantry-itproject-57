import React from 'react';
import { Button } from "@/components/ui/button";
import AuthButton from './AuthButton';
import { Separator } from './ui/separator';


interface BaxterBoxProps {
  warehouseId: number;
  bgColor?: string;
  id: number;
  sku: string;
  units: number;
  isFull: boolean;
}

export default function BaxterBox({ warehouseId, id, sku, units, isFull, bgColor = 'bg-secondary' }: BaxterBoxProps) {

  return (  
    <div className={`${bgColor} border-solid border-border rounded-md p-4 flex flex-col gap-2`}>
      <h1 className='sm:text-lg md:text-xl lg:text-2xl font-bold'>Baxter Box #{id}</h1>
      <h2 className={`sm:text-sm md:text-md lg:text-lg font-bold ${isFull ? 'text-red-500' : 'text-green-500'}`}>
          {isFull ? 'Full' : 'Not full'}
      </h2>
      <h2 className='sm:text-sm md:text-md lg:text-lg'>{units} units</h2>
      <div>
          <h2 className='sm:text-sm md:text-md lg:text-lg'>Contains  SKU#{sku}</h2>
          <h2 className='sm:text-sm md:text-md lg:text-lg'>Located in Warehouse {warehouseId}</h2>
      </div>
    </div>
  );
}

