/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest, NextResponse } from "next/server"


export function  middleware(request:NextRequest){

    const token = request.cookies.get("accessToken")?.value;

    const {pathname} = request.nextUrl; 
    
    // ✅ Public routes (no auth required)
    const publicRoutes = ["/login", "registre"];

    if(publicRoutes.includes(pathname)){
          // If already logged in → redirect to chat
          if(token){
              return NextResponse.redirect(new URL("/chat", request.url));
          }
          return NextResponse.next();
    }

      // ✅ Protect private routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

   // ✅ (Optional but recommended) Token validation
     try {
    // Example: decode token (basic check)
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    )

    // 🔥 Check expiry
    if (payload.exp * 1000 < Date.now()) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()

}


// ✅ Apply middleware only to these routes
export const config = {
  matcher: ['/chat/:path*', '/dashboard/:path*', '/login', '/register'],
}