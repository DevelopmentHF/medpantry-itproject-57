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

export default async function TakeOrder({ searchParams }: { searchParams: { orderNumber: string; datas: string; boxes: string; } }) {
    const orderNumber = searchParams.orderNumber || '';
    const datas = JSON.parse(searchParams.datas || '[]');
    const boxes = JSON.parse(searchParams.boxes || '[]');

    console.log(orderNumber, datas, boxes);

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
