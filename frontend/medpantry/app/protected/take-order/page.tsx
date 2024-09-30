import Order from "@/components/Order";
import { Button } from "@/components/ui/button";

interface OrderProps {
  orderNumber: string;
  cards: { quantity: string; sku: string }[];
  displayTakeOrderButton: boolean
}

export default async function TakeOrder({orderNumber, cards, displayTakeOrderButton}: OrderProps) {


    return (
        <div>
            <Order
                orderNumber={orderNumber}
                cards={cards}
                displayTakeOrderButton={false}
            />
            <Button className='bg-red-600 text-white p-2'>Done</Button>
        </div>
    );
}
