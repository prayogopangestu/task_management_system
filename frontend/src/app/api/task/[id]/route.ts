import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params adalah Promise
) {
  try {
    // UNWRAP PARAMS DENGAN AWAIT
    const { id } = await params;
    console.log('[BACKEND] PUT request dengan ID:', id);
    
    if (!id || id === 'undefined' || isNaN(Number(id))) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid ID format',
          error: 'ID must be a valid number',
          data: null
        },
        { status: 400 }
      );
    }

    const body = await request.json();
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
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params adalah Promise
) {
  try {
    // UNWRAP PARAMS DENGAN AWAIT
    const { id } = await params;
    console.log('[BACKEND] DELETE request dengan ID:', id, 'Tipe:', typeof id);
    
    if (!id || id === 'undefined' || isNaN(Number(id))) {
      console.error('[BACKEND] ID tidak valid:', id);
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid ID format',
          error: `ID must be a valid number, received: ${id}`,
          data: null
        },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get('authorization');
    console.log('[BACKEND] Auth header:', authHeader ? 'Ada' : 'Tidak ada');

    const backendUrl = `http://localhost:8080/api/task/${id}`;
    console.log('[BACKEND] Mengirim ke:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        ...(authHeader && { Authorization: authHeader }),
      },
    });

    console.log('[BACKEND] Response status:', response.status);
    
    const data = await response.json();
    console.log('[BACKEND] Response data:', data);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[BACKEND] API proxy error:', error);
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