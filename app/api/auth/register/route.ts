// FE HR/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';

const HR_API_BASE_URL = process.env.NEXT_PUBLIC_HR_API_URL || 'http://localhost:3001';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Frontend received registration attempt:', body);

    const backendResponse = await fetch(`${HR_API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Check if the backend response was successful
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      console.error('Backend registration failed:', backendResponse.status, errorData);
      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    console.log('Registration successful via backend:', data);
    return NextResponse.json(data, { status: backendResponse.status });

  } catch (error) {
    console.error('Error forwarding registration to backend:', error);
    // Return a generic 500 error if the backend is unreachable or other unexpected errors occur
    return NextResponse.json(
      { message: 'Failed to connect to backend or unexpected error occurred.', error: (error as Error).message },
      { status: 500 }
    );
  }
}
