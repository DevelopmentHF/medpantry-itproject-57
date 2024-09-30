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
	boxes?: number[];
}

export default async function CurrentOrders() {
	// Fetch all orders from Shopify
	let orderArray: OrderProps[] = []; // Define type for orderArray
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

		// Validate the fetched data
		if (!Array.isArray(orderString)) {
			throw new Error('Fetched data is not an array');
		}

		// Fill the array of orders and group items by orderNumber
		const orders = orderString.reduce((acc: Record<string, OrderProps>, item: any) => {
			if (typeof item.orderNumber !== 'string' || typeof item.quantity !== 'number' || typeof item.itemName !== 'string') {
				console.warn('Invalid item structure:', item);
				return acc;
			}

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

		orderArray = Object.values(orders) as OrderProps[];

	} catch (error) {
		console.error("Error fetching orders:", error);
		return <div>Error fetching orders. Please try again later.</div>;
	}

	async function getBoxId(orderNumber: string): Promise<number[]> {
		// Convert # into %23 for /RequiredBaxterBoxes
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

			// Validate the box data structure
			if (!Array.isArray(boxes)) {
				console.warn('Fetched box data is not an array:', boxes);
				return [];
			}

			return boxes.map((item: any) => item.box_id).filter((id: any) => typeof id === 'number'); // Filter invalid box IDs
		} catch (error) {
			console.error("Error fetching box IDs:", error);
			return []; // Return an empty array on error
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
							boxes={order.boxes || []}
							displayTakeOrderButton={true}
						/>
					))}
				</div>
			</div>
			<Button>
                <a
                	href={`/protected/take-order?orderNumber=%231005&datas=${encodeURIComponent(JSON.stringify([{ quantity: 7, itemName: 'Medical Gloves' }]))}&boxes=${encodeURIComponent(JSON.stringify([301]))}`}
                >
                	Go to Take Order
                </a>
            </Button>
		</>
	);
}
