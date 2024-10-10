// app/api/resolveStockChange/route.ts
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const accepted = searchParams.get('accepted');

    if (!id || !accepted) {
        return NextResponse.json({ message: 'Missing required parameters' }, { status: 400 });
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/resolveChange?id=${id}&accepted=${accepted}`, {
            method: 'PATCH',
            headers: {
                'Cache-Control': 'no-cache',
            },
        });

        if (!res.ok) {
            return NextResponse.json({ message: 'Failed to resolve stock change' }, { status: res.status });
        }

        const result = await res.json();
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error resolving stock change:', error);
        return NextResponse.json({ message: 'Error occurred while resolving stock change' }, { status: 500 });
    }
}
