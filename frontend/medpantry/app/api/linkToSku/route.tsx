import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const link = searchParams.get('link');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/linkToSku?link=${link}`);
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
