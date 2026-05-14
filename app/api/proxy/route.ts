import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://drifully-backend-1qa6.onrender.com';
const API_KEY = process.env.DRIFULLY_BACKEND_API_KEY;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');

  if (!path) {
    return NextResponse.json({ error: 'Path is required' }, { status: 400 });
  }

  if (!API_KEY) {
    console.error('Missing DRIFULLY_BACKEND_API_KEY in environment variables');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const forwardParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (key !== 'path') {
        forwardParams.append(key, value);
      }
    });

    const response = await axios.get(`${BACKEND_URL}/${path}`, {
      params: forwardParams,
      headers: {
        'X-API-KEY': API_KEY,
        'Accept': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(`Proxy Error for ${path}:`, error.response?.data || error.message);
    return NextResponse.json(
      error.response?.data || { message: 'Internal Server Error' },
      { status: error.response?.status || 500 }
    );
  }
}
