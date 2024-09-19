import Order from "@/components/Order";
import AuthButton from "@/components/AuthButton";
import { Button } from "@/components/ui/button";

export default async function CurrentOrders() {

    // Fetch all orders from Shopify
    let orderArray: any[] = [];
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/ShopifyOrders`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const orderString = await res.json();
      console.log("orders: " + JSON.stringify(orderString));

      // Fill the array of orders and group items by orderNumber
      const orders = orderString.reduce((acc: any, item: any) => {
        if (!acc[item.orderNumber]) {
          acc[item.orderNumber] = {
            orderNumber: item.orderNumber,
            cards: []
          };
        }
        acc[item.orderNumber].cards.push({
          quantity: item.quantity,
          sku: item.sku,
          itemName: item.itemName
        });
        return acc;
      }, {});

      orderArray = Object.values(orders);

    } catch (error) {
      console.error(error);
      return null;
    }

    console.log("ORDERS ARRAY:");
    console.log(orderArray);

    return (
      <>
        <div className="flex-1 w-full flex flex-col gap-12 items-center p-6">
          <nav className="flex gap-4 border-b border-b-foreground/10 h-16 w-full items-center">
            <Button>
              <a href="../protected">Home</a>
            </Button>

            <div className="ml-auto">
              <AuthButton />
            </div>
          </nav>

          <div className="flex w-full">
            <div className="flex-1 p-6">
              <h1 className="font-bold text-4xl">Outstanding Orders</h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-10">
            {orderArray.map((order) => (
              <Order
                key={order.orderNumber}
                orderNumber={order.orderNumber}
                cards={order.cards}
              />
            ))}
          </div>
        </div>
      </>
    );
}
