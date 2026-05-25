import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://drifully-backend-1qa6.onrender.com';
const API_KEY = process.env.DRIFULLY_BACKEND_API_KEY;

async function handleRequest(request: NextRequest, method: string) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  
  // Custom logout handler
  if (path === 'auth/logout') {
    const response = NextResponse.json({ message: 'Logged out successfully' });
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    return response;
  }

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

    const headers: any = {
      'X-API-KEY': API_KEY,
      'Accept': 'application/json',
    };

    // Do not attach tokens for authentication routes
    const isAuthRoute = path.includes('login') || path.includes('register') || path.includes('verify-otp');
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    
    if (token && !isAuthRoute) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let body: any = undefined;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const contentType = request.headers.get('content-type') || 'application/json';
      headers['Content-Type'] = contentType;
      if (contentType.includes('application/json')) {
        body = await request.json().catch(() => undefined);
      } else {
        body = await request.text().catch(() => undefined);
      }
    }

    const response = await axios({
      method,
      url: `${BACKEND_URL}/${path}`,
      params: forwardParams,
      headers,
      data: body,
    });

    const nextResponse = NextResponse.json(response.data);

    // Set secure cookies when receiving tokens
    if (response.data?.access) {
      nextResponse.cookies.set('accessToken', response.data.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 15, // 15 mins for access token
      });
    }
    if (response.data?.refresh) {
      nextResponse.cookies.set('refreshToken', response.data.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days for refresh token
      });
    }

    return nextResponse;
  } catch (error: any) {
    console.error(`Proxy ${method} Error for ${path}:`, error.response?.data || error.message);
    
    const status = error.response?.status || 500;
    const nextResponse = NextResponse.json(
      error.response?.data || { message: 'Internal Server Error' },
      { status }
    );
    
    // Auto clear cookies on unauthorized from backend
    if (status === 401) {
      nextResponse.cookies.delete('accessToken');
      nextResponse.cookies.delete('refreshToken');
    }

    return nextResponse;
  }
}

export async function GET(request: NextRequest) {
  return handleRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return handleRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return handleRequest(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request, 'DELETE');
}
