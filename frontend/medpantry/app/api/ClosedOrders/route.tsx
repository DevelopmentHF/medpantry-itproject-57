import { NextResponse } from 'next/server';
interface OrderStringType {
    sku: string[];
    quantity: number[];
    orderNumber: string;
    itemName: string[];
    id: string;
  }

  interface OrderTakenFromProps {
    orderNumber: number;
    orderID: string;
    locationIDs: number[];
    units: number[];
  }
  
  interface Data {
    quantity: number;
    sku: string;
    itemName: string;
  }
  
  interface OrderProps {
    orderNumber: string;
    datas: Data[];
    boxes?: number[][];
  }

export async function GET(req: Request): Promise<NextResponse<OrderProps[]>> {

    const apiKey = process.env.NEXT_PUBLIC_API_KEY

    // Throw an error if API_KEY is not defined
    if (!apiKey) {
        console.error('API key is not defined');
        return NextResponse.json([], { status: 500 });
    }

    // Fetch all orders from Shopify
    let orderArray: OrderProps[] = []; 
    try {
        // Force a fresh fetch by passing timestamp
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/ClosedOrders?timestamp=${Date.now()}`, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache',
            'API-Key': apiKey,
        },
        });
        if (!res.ok) {
            return NextResponse.json([], { status: 500 });
        }
        let orderString: OrderStringType[] = await res.json();

        // Fill the array of orders and group items by orderNumber. 
        // Note that this does not fetch the required Baxter Boxes. This will be handled later. 
        const orders = orderString.reduce((acc: Record<string, OrderProps>, item: any) => {

        if (!acc[item.orderNumber]) {
            acc[item.orderNumber] = {
            orderNumber: item.orderNumber,
            datas: [],
            };
        }
        for(let i = 0; i < item.sku.length; i ++){
            acc[item.orderNumber].datas.push({
            quantity: item.quantity[i],
            sku: item.sku[i],
            itemName: item.itemName[i],
            });
        }
        return acc;
        }, {});

        orderArray = Object.values(orders) as OrderProps[];

    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json([], { status: 500 });
    }

    function boxByItems(boxString: OrderTakenFromProps, datas: Data[]){
        let output: number[][] = [];
        if(!boxString) return output;

        const boxes = boxString.locationIDs;
        const units = boxString.units;

        for(let item = 0, entry = 0; item < datas.length && entry < boxes.length; item ++){
            output.push([]);
            for(let currQuantity = 0; currQuantity < datas[item].quantity; currQuantity += units[entry], entry ++){
                output[item].push(+boxes[entry]);
            }
        }
        return output;
    }

    // Function used later to fetch the Baxter Boxes needed for each order.    
    async function getBoxId(order: OrderProps): Promise<number[][]> {
        // Convert # into %23 for /RequiredBaxterBoxes
        const value: string = encodeURIComponent(order.orderNumber);

        // Throw an error if API_KEY is not defined
        if (!apiKey) {
        console.error('API key is not defined');
        throw new Error('API Key was not ok'); 
        }

        try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/OrderTakenFrom?orderNumber=${value}&timestamp=${Date.now()}`, {
            method: 'GET',
            headers: {
            'Cache-Control': 'no-cache',
            'API-Key': apiKey,
            },
        });

        if (!res.ok) throw new Error('Network response was not ok');

        const result: OrderTakenFromProps = await res.json();
        const boxes = boxByItems(result, order.datas);

        // Validate the box data structure
        if (!Array.isArray(boxes)) {
            console.warn('Fetched box data is not an array:', boxes);
            return [];
        }

        //return boxes.map((item: any) => item.map((entry: any) => entry.box_id));
        return boxes;
        } catch (error) {
        console.error("Error fetching box IDs:", error);
        return []; 
        }
    }

    // Prepare orders with their corresponding box IDs
    const ordersWithBoxIds = await Promise.all(
        orderArray.map(async (order) => {
            const boxes: number[][] = await getBoxId(order);
            //const boxes: number[][] = [] //hardcoding temporarily
            return {
                ...order,
                boxes: boxes || [],
            };
        })
    );
    return NextResponse.json(ordersWithBoxIds, { status: 200 });
}
