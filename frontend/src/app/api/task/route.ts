import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/task
 * Proxy create task request to backend
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');

    const response = await fetch('http://localhost:8080/api/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: String(error),
        data: null,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/task
 * Proxy get all tasks request to backend
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    const response = await fetch('http://localhost:8080/api/task/list', {
      method: 'GET',
      headers: {
        ...(authHeader && { Authorization: authHeader }),
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: String(error),
        data: null,
      },
      { status: 500 }
    );
  }
}
