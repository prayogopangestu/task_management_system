import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validasi ID
    const id = params.id;
    if (!id || id === "undefined" || isNaN(Number(id))) {
      return NextResponse.json(
        { 
          success: false,
          message: "Invalid ID format",
          error: "ID must be a valid number",
          data: null
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
        data: null
      },
      { status: 500 }
    );
  }
}