import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from './ui/separator';
import OrderLine from '@/components/OrderLine';

interface Data {
	quantity: number;
	sku: string;
	itemName: string;
}

interface OrderProps {
	orderNumber: string;
	datas: Data[];
	boxes: number[];
	displayTakeOrderButton: boolean;
}

export default function Order({ orderNumber, datas = [], boxes, displayTakeOrderButton }: OrderProps) {
	return (
		<div className={`bg-secondary-foreground border-solid border-border rounded-md p-4 flex flex-col gap-2`}>
			<div className="flex flex-row gap-4 w-full items-center">
				<h1 className="text-2xl font-bold">Order {orderNumber}</h1>
				{displayTakeOrderButton && (
					<Button className='bg-red-600 text-white p-2'>Take Order</Button>
				)}
			</div>
			<Separator />
			{datas.map((data) => (
				<OrderLine
					key={data.sku}
					name={data.itemName}
					quantity={data.quantity}
					boxNumbers={boxes}
				/>
			))}
		</div>
	);
}
