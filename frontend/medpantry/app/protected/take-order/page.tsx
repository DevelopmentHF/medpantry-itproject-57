import Order from "@/components/Order";
import AuthButton from "@/components/AuthButton";
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
        <div className="flex-1 w-full flex flex-col gap-12 items-center p-6">
            <nav className="flex gap-4 border-b border-b-foreground/10 h-16 w-full items-center justify-between">

                <Button>
                    <a href="../protected">
                        Home
                    </a>
                </Button>

                <AuthButton />
            </nav>
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
