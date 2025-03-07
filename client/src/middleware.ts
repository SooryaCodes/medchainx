import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const patientToken = request.cookies.get('token')?.value;
  const patientId = request.cookies.get('patientId')?.value;
  
  // Check if the path starts with /patient
  if (request.nextUrl.pathname.startsWith('/patient')) {
    // If no token or patientId, redirect to register page
    if (!patientToken || !patientId) {
      return NextResponse.redirect(new URL('/register', request.url));
    }
  }
  
  // Check if trying to access register page while already authenticated
  if (request.nextUrl.pathname === '/register' || request.nextUrl.pathname === '/register/') {
    // If token exists, redirect to patient dashboard
    if (patientToken && patientId) {
      return NextResponse.redirect(new URL('/patient/dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/patient/:path*', '/register'],
}; 