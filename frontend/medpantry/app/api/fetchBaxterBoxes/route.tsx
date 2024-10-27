// /app/api/fetchBaxterBoxes/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sku = searchParams.get('sku');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/allBaxterBoxesBySKU?sku=${sku}`);
        if (!response.ok) {
            return NextResponse.json({ message: 'Failed to fetch boxes' }, { status: response.status });
        }

        const boxes = await response.json();
        return NextResponse.json(boxes, { status: 200 });
    } catch (error) {
        console.error('Error fetching boxes:', error);
        return NextResponse.json({ message: 'Error occurred while fetching data' }, { status: 500 });
    }
}
