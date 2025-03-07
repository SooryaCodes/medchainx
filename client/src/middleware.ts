import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const patientToken = request.cookies.get('patientToken')?.value;
  const patientId = request.cookies.get('patientId')?.value;
  
  // Check if the path starts with /patient
  if (request.nextUrl.pathname.startsWith('/patient')) {
    // If no token or patientId, redirect to register page
    if (!patientToken || !patientId) {
      return NextResponse.redirect(new URL('/register', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/patient/:path*'],
}; 