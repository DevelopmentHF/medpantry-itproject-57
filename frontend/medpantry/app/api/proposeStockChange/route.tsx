import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url);
    const box = searchParams.get('box');
    const sku = searchParams.get('sku');
    const proposedQuantityToAdd = searchParams.get('proposedQuantityToAdd');
    const fullStatusChangedTo = searchParams.get('fullStatusChangedTo');

    // Log received parameters
    console.log('Received parameters:', { box, sku, proposedQuantityToAdd, fullStatusChangedTo });

    if (!box || !sku || !proposedQuantityToAdd) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }


    const apiKey = process.env.NEXT_PUBLIC_API_KEY

    // Throw an error if API_KEY is not defined
    if (!apiKey) {
        console.error('API key is not defined');
        return NextResponse.json({ message: 'API key is not defined' }, { status: 500 });
    }


    try {
        const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/proposeChange?box=${box}&sku=${sku}&proposedQuantityToAdd=${proposedQuantityToAdd}${fullStatusChangedTo ? `&fullStatusChangedTo=${fullStatusChangedTo}` : ''}`, {
            method: 'POST',
            headers: {
                'API-Key': apiKey,
            }
        });

        // Check the response from the backend
        if (!backendRes.ok) {
            const errorBody = await backendRes.text(); // Capture the response body for debugging
            console.error('Backend error response:', errorBody);
            return NextResponse.json({ error: 'Failed to propose stock change' }, { status: backendRes.status });
        }

        const result = await backendRes.json();
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error occurred while proposing stock change:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
