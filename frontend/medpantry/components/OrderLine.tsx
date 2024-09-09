import React from 'react';
import { Button } from "@/components/ui/button";
import AuthButton from './AuthButton';
import { Separator } from './ui/separator';

interface OrderLineProps {
  name: string;
  quantity: string;
  boxNumber: string;
}

export default function OrderLine({ name, quantity, boxNumber }: CardProps) {


  return (

    <div className={`flex gap-4`}>
        <div className="">
            <h1 className="">x{quantity} {name}</h1>
        </div>
        <div className="">
            <h2 className='text-black'>Box #{boxNumber}</h2>
        </div>
    </div>
  );
}

