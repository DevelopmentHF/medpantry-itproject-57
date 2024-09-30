import React from 'react';
import { Button } from "@/components/ui/button";
import AuthButton from './AuthButton';
import { Separator } from './ui/separator';

interface OrderLineProps {
  name: string;
  quantity: string;
  boxNumbers: number[];
}

export default function OrderLine({ name, quantity, boxNumbers }: OrderLineProps) {

  return (

    <div className={`flex gap-4`}>
        <div className="">
            <h1 className="">{name} <span className='text-gray-500'>x{quantity}</span></h1>
        </div>
        <div className="">
            <h2 className='text-black'>Box <span className='text-gray-500'>#{boxNumbers.join(', ')}</span></h2>
        </div>
    </div>
  );
}

