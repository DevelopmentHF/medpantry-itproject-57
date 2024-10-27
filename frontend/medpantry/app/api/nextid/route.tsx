import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sku = searchParams.get('sku');

    const apiKey = process.env.NEXT_PUBLIC_API_KEY

    // Throw an error if API_KEY is not defined
    if (!apiKey) {
        console.error('API key is not defined');
        return NextResponse.json({ message: 'API key is not defined' }, { status: 500 });
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/nextBoxId?sku=${sku}`, {
            headers: {
                'API-Key': apiKey, // Include the API key in the headers
            },
        });
        if (!response.ok) {
            return NextResponse.json({ message: 'Failed to fetch the next box ID' }, { status: response.status });
        }

        const nextBoxId = await response.json(); // Assuming the response is just the ID
        return NextResponse.json(nextBoxId, { status: 200 });
    } catch (error) {
        console.error('Error fetching next box ID:', error);
        return NextResponse.json({ message: 'Error occurred while fetching the next box ID' }, { status: 500 });
    }
}
