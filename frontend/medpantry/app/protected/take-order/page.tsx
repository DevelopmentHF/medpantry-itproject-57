import Order from "@/components/Order";
import AuthButton from "@/components/AuthButton";
import { Button } from "@/components/ui/button";
import DoneOrderButton from "@/components/DoneOrderButton";

interface Data {
  quantity: number;
  sku: string;
  itemName: string;
}

export default async function TakeOrder({ searchParams }: { searchParams: { orderNumber: string; datas: string; boxes: string; } }) {
  // Upon completion of order, the order is removed by pressing the Done button. 
  // That logic is handled within DoneOrderButton component

  // Extract orderNumber, datas, and boxes from search params
  const orderNumber = searchParams.orderNumber || '';
  const datas: Data[] = JSON.parse(searchParams.datas || '[]');
  const boxes: number[][] = JSON.parse(searchParams.boxes || '[]');

  console.log(orderNumber, datas, boxes);

  return (
    <div className="flex-1 w-full flex flex-col gap-12 items-center p-6">
      <nav className="flex gap-4 border-b border-b-foreground/10 h-16 w-full items-center justify-between">
        <Button>
          <a href="../protected/current-orders">
            Back
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
      <DoneOrderButton orderNumber={orderNumber} />
    </div>
  );
}
