import Order from "@/components/Order";
import AuthButton from "@/components/AuthButton";
import { Button } from "@/components/ui/button";

interface OrderDataItem {
	quantity: number;
	itemName: string;
}

interface OrderData {
	orderNumber: string;
	datas: OrderDataItem[];
}

export default async function CurrentOrders() {
	// Fetch all orders from Shopify
	let orderArray: OrderData[] = []; // Define type for orderArray
	try {
		// Force a fresh fetch by passing timestamp
		const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/ShopifyOrders?timestamp=${Date.now()}`, {
			method: 'GET',
			headers: {
				'Cache-Control': 'no-cache',
			},
		});
		if (!res.ok) throw new Error('Network response was not ok');
		const orderString = await res.json();
		console.log("orders", orderString);

		// Fill the array of orders and group items by orderNumber
		const orders = orderString.reduce((acc: Record<string, OrderData>, item: any) => {
			if (!acc[item.orderNumber]) {
				acc[item.orderNumber] = {
					orderNumber: item.orderNumber,
					datas: [],
				};
			}
			acc[item.orderNumber].datas.push({
				quantity: item.quantity,
				itemName: item.itemName,
			});
			return acc;
		}, {});

		orderArray = Object.values(orders) as OrderData[];

	} catch (error) {
		console.error(error);
		return null;
	}

	async function getBoxId(orderNumber: string): Promise<number[] | null> {
		// convert # into %23 for /RequiredBaxterBoxes
		const value: string = encodeURIComponent(orderNumber);

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/RequiredBaxterBoxes?orderNumber=${value}`, {
				method: 'GET',
				headers: {
					'Cache-Control': 'no-cache',
				},
			});
			if (!res.ok) throw new Error('Network response was not ok');
			const boxes = await res.json();
			return boxes.map((item: any) => item.box_id);
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	// Prepare orders with their corresponding box IDs
	const ordersWithBoxIds = await Promise.all(
		orderArray.map(async (order) => {
			const boxes = await getBoxId(order.orderNumber);
			return {
				...order,
				boxes: boxes || [],
			};
		})
	);

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
					{ordersWithBoxIds.map((order) => (
						<Order
							key={order.orderNumber}
							orderNumber={order.orderNumber}
							datas={order.datas}
							boxes={order.boxes}
							displayTakeOrderButton={true}
						/>
					))}
				</div>
			</div>
		</>
	);
}
