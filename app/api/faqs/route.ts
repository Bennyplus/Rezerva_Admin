import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('https://drifully-backend-1qa6.onrender.com/api/v1/accounts/faqs/', {
      headers: {
        'X-API-KEY': 'P5aatlVl.cVaYDgzZzSyztw8afqNzv0y6PyQ4yYau',
        'Accept': 'application/json',
      },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Proxy FAQ Error:', error.response?.data || error.message);
    return NextResponse.json(
      { message: 'Failed to fetch FAQs' },
      { status: error.response?.status || 500 }
    );
  }
}
