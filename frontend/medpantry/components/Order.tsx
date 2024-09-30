import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from './ui/separator';
import OrderLine from '@/components/OrderLine';

interface Data {
	quantity: number;
	itemName: string;
}

interface OrderProps {
	orderNumber: string;
	datas: Data[];
	boxes: number[];
	displayTakeOrderButton: boolean;
}

export default function Order({ orderNumber, datas = [], boxes = [], displayTakeOrderButton }: OrderProps) {
	// Validate the datas prop to ensure it has the expected structure
	const isDataValid = (data: any): data is Data => {
		return typeof data === 'object' && data !== null &&
			typeof data.quantity === 'number' &&
			typeof data.itemName === 'string';
	};

	return (
		<div className={`bg-secondary-foreground border-solid border-border rounded-md p-4 flex flex-col gap-2`}>
			<div className="flex flex-row gap-4 w-full items-center">
				<h1 className="text-2xl font-bold">Order {orderNumber}</h1>
				{displayTakeOrderButton && (
					<Button className='bg-red-600 text-white p-2'>Take Order</Button>
				)}
			</div>
			<Separator />
			{datas.length > 0 ? (
				datas.filter(isDataValid).map((data) => (
					<OrderLine
						key={data.sku}
						name={data.itemName}
						quantity={data.quantity}
						boxNumbers={boxes}
					/>
				))
			) : (
				<p>No items found in this order.</p>
			)}
		</div>
	);
}
