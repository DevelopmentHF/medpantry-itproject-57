import React from 'react';
import { Button } from "@/components/ui/button";
import AuthButton from './AuthButton';
import { Separator } from './ui/separator';

interface OrderLineProps {
  name: string;
  quantity: string;
  boxNumber: string;
}

export default function OrderLine({ name, quantity, boxNumber }: OrderLineProps) {


  return (

    <div className={`flex gap-4`}>
        <div className="">
            <h1 className="">{name} <span className='text-gray-500'>x{quantity}</span></h1>
        </div>
        <div className="">
            <h2 className='text-black'>Box <span className='text-gray-500'>#{boxNumber}</span></h2>
        </div>
    </div>
  );
}
