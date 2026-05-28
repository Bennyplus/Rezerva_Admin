import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://drifully-backend-1qa6.onrender.com';
const API_KEY = process.env.DRIFULLY_BACKEND_API_KEY;

let activeRefreshPromise: Promise<{ access: string; refresh: string }> | null = null;

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

      if (contentType.includes('application/json')) {
        headers['Content-Type'] = contentType;
        body = await request.json().catch(() => undefined);
      } else if (contentType.includes('multipart/form-data')) {
        // Do not set Content-Type header manually here because axios 
        // needs to automatically set it with the correct boundary
        body = await request.formData().catch(() => undefined);
      } else {
        headers['Content-Type'] = contentType;
        body = await request.text().catch(() => undefined);
      }
    }

    let response;
    try {
      response = await axios({
        method,
        url: `${BACKEND_URL}/${path}`,
        params: forwardParams,
        headers,
        data: body,
        responseType: 'arraybuffer',
      });
    } catch (error: any) {
      if (error.response?.status === 401) {
        const refreshToken = cookieStore.get('refreshToken')?.value;
        if (refreshToken) {
          try {
            if (!activeRefreshPromise) {
              activeRefreshPromise = axios.post(
                `${BACKEND_URL}/api/v1/accounts/token/refresh/`,
                { refresh: refreshToken },
                {
                  headers: {
                    'X-API-KEY': API_KEY,
                    'Accept': 'application/json',
                  }
                }
              ).then(res => {
                return {
                  access: res.data.access,
                  refresh: res.data.refresh || refreshToken,
                };
              }).finally(() => {
                // Clear the promise so future 401s will trigger a new refresh
                activeRefreshPromise = null;
              });
            }

            const newTokens = await activeRefreshPromise;

            // Retry original request with new token
            headers['Authorization'] = `Bearer ${newTokens.access}`;
            response = await axios({
              method,
              url: `${BACKEND_URL}/${path}`,
              params: forwardParams,
              headers,
              data: body,
              responseType: 'arraybuffer',
            });

            // Pass the new tokens down to be set as cookies
            (response as any)._newTokens = newTokens;
          } catch (refreshError) {
            console.error('Token refresh failed');
            throw error; // Throw original 401 to clear cookies
          }
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }

    const contentType = response.headers['content-type'] || '';
    let nextResponse;

    if (contentType.includes('application/json')) {
      const jsonString = Buffer.from(response.data).toString('utf-8');
      nextResponse = NextResponse.json(JSON.parse(jsonString));
    } else {
      nextResponse = new NextResponse(response.data, {
        headers: {
          'Content-Type': contentType,
          ...(response.headers['content-disposition'] && { 'Content-Disposition': response.headers['content-disposition'] }),
        }
      });
    }

    // Get tokens from either login/register response or refreshed tokens
    let accessToSet = undefined;
    let refreshToSet = undefined;

    if (contentType.includes('application/json')) {
      const jsonData = JSON.parse(Buffer.from(response.data).toString('utf-8'));
      accessToSet = jsonData?.access;
      refreshToSet = jsonData?.refresh;
    }

    accessToSet = accessToSet || (response as any)._newTokens?.access;
    refreshToSet = refreshToSet || (response as any)._newTokens?.refresh;

    // Set secure cookies when receiving tokens
    if (accessToSet) {
      nextResponse.cookies.set('accessToken', accessToSet, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 15, // 15 mins for access token
      });
    }
    if (refreshToSet) {
      nextResponse.cookies.set('refreshToken', refreshToSet, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days for refresh token
      });
    }

    return nextResponse;
  } catch (error: any) {
    console.error(`Proxy ${method} Error for ${path}:`, error.message);

    let errorData = { message: 'Internal Server Error' };
    if (error.response?.data) {
      if (Buffer.isBuffer(error.response.data) || error.response.data instanceof ArrayBuffer) {
        try {
          errorData = JSON.parse(Buffer.from(error.response.data).toString('utf-8'));
        } catch (e) {
          // Keep default error
        }
      } else {
        errorData = error.response.data;
      }
    }

    const status = error.response?.status || 500;
    const nextResponse = NextResponse.json(errorData, { status });

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

export async function PATCH(request: NextRequest) {
  return handleRequest(request, 'PATCH');
}
