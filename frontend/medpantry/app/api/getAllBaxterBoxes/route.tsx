import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/baxterbox`);
        if (!response.ok) {
            return NextResponse.json({ message: 'Failed to fetch BaxterBoxes' }, { status: response.status });
        }

        const boxes = await response.json();
        return NextResponse.json(boxes, { status: 200 });
    } catch (error) {
        console.error('Error fetching BaxterBoxes:', error);
        return NextResponse.json({ message: 'Error occurred while fetching data' }, { status: 500 });
    }
}
