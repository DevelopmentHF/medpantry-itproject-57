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
    <div className={`bg-card-foreground border-solid border-border rounded-md p-4 flex flex-col gap-2 w-full`}>
      <div className="flex justify-between">
        <h1 className='sm:text-lg md:text-xl lg:text-2xl font-bold'>Baxter Box</h1>
        <h1 className="sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-400">#{id}</h1>
      </div>

      <h2 className={`sm:text-sm md:text-md lg:text-lg font-bold ${isFull ? 'text-red-500' : 'text-green-500'}`}>
          {isFull ? 'Full' : 'Not full'}
      </h2>

      <div className="flex justify-between">
                <p>Units</p>
                <p className="text-gray-400">{units}</p>
      </div>

      <div className="flex justify-between">
                <p>SKU</p>
                <p className="text-gray-400">{sku}</p>
      </div>

      <div className="flex justify-between">
                <p>Located in Warehouse</p>
                <p className="text-gray-400">#{warehouseId}</p>
      </div>
    </div>
  );
}

