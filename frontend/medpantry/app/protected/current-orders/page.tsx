import Order from "@/components/Order";
import AuthButton from "@/components/AuthButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/TableCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";

export default async function CurrentOrders() {

    //Fetch all orders from Shopify
    let orderString: any[] = [];
        try{
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/ShopifyOrders`, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache'
            }
            });
            if (!res.ok) throw new Error('Network response was not ok');
            orderString = await res.json();
            console.log("orders: " + JSON.stringify(orderString));
            
        } catch (error) {
        console.error(error);
        return null;
      }

      //console.log("ORDERS:")
      //console.log(orderString);
      
    //Group orders by order number.
    const groupedByOrderNumber = orderString.reduce((acc, item) => {
      if (!acc[item.order_number]) {
        acc[item.order_number] = []; // Initialize array for new order_number
      }
      acc[item.order_number].push({
        quantity: item.quantity,
        sku: item.sku,
      })
      return acc;
    }, {});

    // Object.keys(groupedByOrderNumber).forEach(order_number => {console.log(order_number)});
    //console.log(groupedByOrderNumber["#1001"]);

    return (
      <>
        <div className="flex-1 w-full flex flex-col gap-12 items-center p-6">
          <nav className="flex gap-4 border-b border-b-foreground/10 h-16 w-full items-center">
            <Button className="hover:bg-slate-200">
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
            {Object.keys(groupedByOrderNumber).map((order_number) => (
              <Order
                key={order_number}
                orderNumber={order_number}
                cards={groupedByOrderNumber[order_number]}
              />
            ))}
          </div>

          {Object.keys(groupedByOrderNumber).map((order_number) => (
            <Card
              key={order_number}
              className=" border-gray-200 shadow-sm w-full flex flex-col items-center"
            >
              <CardHeader className="flex flex-row items-center justify-between bg-white w-full p-6">
                <CardTitle className="text-gray-800 flex items-center flex-wrap">
                  <span className="text-2xl font-bold">
                    Order {order_number}
                  </span>
                </CardTitle>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Take Order
                </Button>
              </CardHeader>
              <CardContent className="w-full bg-white p-6">
                <Table className="ml-auto mr-auto">
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50 border-gray-100">
                      <TableHead className="text-gray-600">
                        <span className="flex items-center">Item</span>
                      </TableHead>
                      <TableHead className="text-gray-600 text-center">
                        <span className="flex items-center">
                          Total Quantity
                        </span>
                      </TableHead>
                      <TableHead className="text-gray-600">
                        <span className="flex items-center">Warehouse Location</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {groupedByOrderNumber[order_number].map((card) => (
                      <TableRow
                        key={card.sku}
                        className="bg-white hover:bg-gray-50 border-b border-gray-100"
                      >
                        <TableCell className="font-medium text-gray-700 w-1/3">
                          <span className="flex items-center">
                            item names go here
                          </span>
                        </TableCell>

                        <TableCell className="text-gray-700 w-1/3 text-center">
                          <span className="flex items-center">
                            {card.quantity}
                          </span>
                        </TableCell>

                        <TableCell className="text-gray-700 w-1/3">
                          <span className="flex items-center">
                            Box #{card.sku}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    );
}