import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)']);
const isApiRoute = createRouteMatcher(['/api(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;
  const isOnboarded = sessionClaims?.metadata?.isOnboarded;
  console.log(typeof isOnboarded, isOnboarded); 

  // user not logged in
  if(!userId && !isPublicRoute(req) && !isApiRoute(req)) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
  // user logged in, not onboarded and not in onboarding route
  if(userId && role !== "admin" && !isOnboarded && !isOnboardingRoute(req) && !isApiRoute(req)) {
    return NextResponse.redirect(new URL('/onboarding', req.url));
  }

  // user logged in, onboarded and in onboarding/public/admin routes
  if(userId && role !== "admin" && isOnboarded && (isOnboardingRoute(req) || isPublicRoute(req) || isAdminRoute(req))) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  // user logged in and in public route
  if(userId && role === "admin" && (isPublicRoute(req) || isOnboardingRoute(req))) {
    return NextResponse.redirect(new URL('/admin/home', req.url));
  }

  // admin anywhere outside admin routes -> admin dashboard
  if(userId && role === "admin" && !isAdminRoute(req) && !isApiRoute(req)) {
    return NextResponse.redirect(new URL('/admin/home', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Always run for Clerk-specific frontend API routes
    '/__clerk/(.*)',
  ],
}