import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Skip middleware for the home page and public pages
  if (request.nextUrl.pathname === '/' || 
      request.nextUrl.pathname.startsWith('/_next') || 
      request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const patientToken = request.cookies.get('patientToken')?.value;
  const patientId = request.cookies.get('patientId')?.value;
  const doctorToken = request.cookies.get('doctorToken')?.value;
  const doctorId = request.cookies.get('doctorId')?.value;
  
  // Check if the path starts with /patient
  if (request.nextUrl.pathname.startsWith('/patient')) {
    // If no token or patientId, redirect to register page
    if (!patientToken || !patientId) {
      return NextResponse.redirect(new URL('/register', request.url));
    }
  }
  
  // Check if the path starts with /doctor
  if (request.nextUrl.pathname.startsWith('/doctor')) {
    // If no token or doctorId, redirect to register page
    if (!doctorToken || !doctorId) {
      return NextResponse.redirect(new URL('/register', request.url));
    }
  }
  
  // Check if trying to access register page while already authenticated
  if (request.nextUrl.pathname === '/register' || request.nextUrl.pathname === '/register/') {
    // If token exists, redirect to patient dashboard
    if (patientToken && patientId) {
      return NextResponse.redirect(new URL('/patient/dashboard', request.url));
    }
    if (doctorToken && doctorId) {
      return NextResponse.redirect(new URL('/doctor/dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 