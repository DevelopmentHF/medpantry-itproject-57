import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const link = searchParams.get('link');

    const apiKey = process.env.NEXT_PUBLIC_API_KEY

    // Throw an error if API_KEY is not defined
    if (!apiKey) {
        console.error('API key is not defined');
        return NextResponse.json({ message: 'API key is not defined' }, { status: 500 });
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/linkToSku?link=${link}`, {
            headers: {
                'API-Key': apiKey, // Include the API key in the headers
            },
        });
        if (!response.ok) {
            return NextResponse.json({ message: 'Failed to fetch the sku from the link' }, { status: response.status });
        }

        const extractedSku = await response.json(); 
        return NextResponse.json(extractedSku, { status: 200 });
    } catch (error) {
        console.error('Error fetching link to sku:', error);
        return NextResponse.json({ message: 'Error occurred while fetching the sku from the provided link' }, { status: 500 });
    }
}
