import { NextResponse } from 'next/server';

export async function GET(req: Request) {

    let logEntries: any[] = [];
    
    const apiKey = process.env.NEXT_PUBLIC_API_KEY

    // Throw an error if API_KEY is not defined
    if (!apiKey) {
        console.error('API key is not defined');
        return NextResponse.json({ message: 'API key is not defined' }, { status: 500 });
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/logEntries?timestamp=${Date.now()}`, {
            headers: {
                'API-Key': apiKey
            },
        });
        if (!res.ok) {
            return NextResponse.json({ message: 'Failed to fetch stock updates' }, { status: res.status });
        }

        logEntries = await res.json();
        logEntries = logEntries.filter((entry) => entry.pending);
        return NextResponse.json(logEntries, { status: 200 });
    } catch (error) {
        console.error('Error fetching stock updates:', error);
        return NextResponse.json({ message: 'Error occurred while fetching stock updates' }, { status: 500 });
    }
}
