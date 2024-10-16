import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
    try {
        const { orderNumber } = await req.json(); // Extract orderNumber from the JSON body

        console.log('Received parameters:', { orderNumber });

        if (!orderNumber) {
            return NextResponse.json({ error: 'Missing required parameter: orderNumber' }, { status: 400 });
        }

        // Send the request to the Spring Boot backend
        const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/HandleOrderAccept?orderNumber=${encodeURIComponent(orderNumber)}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Handle the backend response
        if (!backendRes.ok) {
            const errorBody = await backendRes.text(); // Get the error response body
            console.error('Backend error response:', errorBody);
            return NextResponse.json({ error: errorBody }, { status: backendRes.status });
        }

        // Assuming the backend response is a success message
        const successMessage = await backendRes.text(); // Get the success response body as text
        return NextResponse.json({ message: successMessage }, { status: 200 });

    } catch (error) {
        console.error('Error occurred while handling order accept:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}