import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://drifully-backend-1qa6.onrender.com';
const API_KEY = process.env.DRIFULLY_BACKEND_API_KEY;

let activeRefreshPromise: Promise<{ access: string; refresh: string }> | null = null;
let lastRefreshedTokens: { access: string; refresh: string; timestamp: number } | null = null;

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
        // Convert the Next.js Web FormData to a Node.js form-data instance.
        // Axios re-serialises Web FormData and collapses repeated keys into a
        // single comma-joined string. form-data preserves each entry separately,
        // which is required for list fields like specific_recipients.
        const webFormData = await request.formData().catch(() => undefined);
        if (webFormData) {
          const NodeFormData = (await import('form-data')).default;
          const nodeForm = new NodeFormData();
          for (const [key, value] of webFormData.entries()) {
            if (value instanceof Blob) {
              const buffer = Buffer.from(await value.arrayBuffer());
              nodeForm.append(key, buffer, {
                filename: (value as File).name || 'upload',
                contentType: value.type || 'application/octet-stream',
              });
            } else {
              nodeForm.append(key, value);
            }
          }
          body = nodeForm;
          // Let form-data set the correct Content-Type + boundary automatically
          Object.assign(headers, nodeForm.getHeaders());
        }
      } else {
        headers['Content-Type'] = contentType;
        body = await request.text().catch(() => undefined);
      }
    }

    if (searchParams.get('export') === 'xlsx') {
      const fetchResponse = await fetch(
        `${BACKEND_URL}/${path}?${forwardParams.toString()}`,
        {
          method,
          headers: {
            ...(headers.Authorization && {
              Authorization: headers.Authorization,
            }),
            'X-API-KEY': API_KEY,
            Accept: '*/*',
          },
        }
      );

      return new NextResponse(fetchResponse.body, {
        status: fetchResponse.status,
        headers: {
          'Content-Type':
            fetchResponse.headers.get('content-type') ||
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

          'Content-Disposition':
            fetchResponse.headers.get('content-disposition') ||
            'attachment; filename="bookings.xlsx"',
        },
      });
    }
    // -----------------------------------------

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
        const failedAccessToken = token;

        if (refreshToken) {
          try {
            let newTokens: { access: string; refresh: string } | null = null;

            if (activeRefreshPromise) {
              newTokens = await activeRefreshPromise;
            } else if (
              lastRefreshedTokens &&
              Date.now() - lastRefreshedTokens.timestamp < 10000 &&
              failedAccessToken !== lastRefreshedTokens.access
            ) {
              // We just refreshed the token recently, and this request failed using the old token.
              // Reuse the newly minted token instead of refreshing again.
              newTokens = { access: lastRefreshedTokens.access, refresh: lastRefreshedTokens.refresh };
            } else {
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
                const refreshed = {
                  access: res.data.access,
                  refresh: res.data.refresh || refreshToken,
                };
                lastRefreshedTokens = { ...refreshed, timestamp: Date.now() };
                return refreshed;
              }).finally(() => {
                // Clear the promise so future 401s will trigger a new refresh
                activeRefreshPromise = null;
              });

              newTokens = await activeRefreshPromise;
            }

            if (newTokens) {
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
            } else {
              throw error;
            }
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

    const contentType = (response.headers['content-type'] as string) || '';
    let nextResponse;

    if (contentType.includes('application/json')) {
      const jsonString = Buffer.from(response.data).toString('utf-8');
      nextResponse = NextResponse.json(JSON.parse(jsonString));
    } else {
      const fallbackContentType = contentType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const fallbackDisposition = (response.headers['content-disposition'] as string) || `attachment; filename="export_${Date.now()}.xlsx"`;

      nextResponse = new NextResponse(response.data, {
        headers: {
          'Content-Type': fallbackContentType,
          'Content-Disposition': fallbackDisposition,
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
