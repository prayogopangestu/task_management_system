import { NextRequest, NextResponse } from 'next/server';

/**
 * DELETE /api/task/[id]
 * Proxy delete task request to backend
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validasi ID
    if (!id || id === 'undefined' || isNaN(Number(id))) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid ID format',
          error: 'ID must be a valid number',
          data: null,
        },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get('authorization');

    const response = await fetch(`http://localhost:8080/api/task/${id}`, {
      method: 'DELETE',
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

/**
 * GET /api/task/[id]
 * Proxy get task request to backend
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validasi ID
    if (!id || id === 'undefined' || isNaN(Number(id))) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid ID format',
          error: 'ID must be a valid number',
          data: null,
        },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get('authorization');

    const response = await fetch(`http://localhost:8080/api/task/${id}`, {
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

/**
 * PUT /api/task/[id]
 * Proxy update task request to backend
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validasi ID
    if (!id || id === 'undefined' || isNaN(Number(id))) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid ID format',
          error: 'ID must be a valid number',
          data: null,
        },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get('authorization');

    const response = await fetch(`http://localhost:8080/api/task/${id}`, {
      method: 'PUT',
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
