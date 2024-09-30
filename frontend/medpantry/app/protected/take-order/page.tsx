import Order from "@/components/Order";
import { Button } from "@/components/ui/button";

interface Data {
	quantity: number;
	itemName: string;
}

interface OrderProps {
	orderNumber: string;
	datas: Data[];
	boxes: number[];
}

export default async function TakeOrder({orderNumber, datas, boxes}: OrderProps) {


    return (
        <div>
            <Order
                orderNumber={orderNumber}
                datas={datas}
                boxes={boxes}
                displayTakeOrderButton={false}
            />
            <Button className='bg-red-600 text-white p-2'>Done</Button>
        </div>
    );
}
