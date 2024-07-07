import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
        console.log('No token found, redirecting to login');
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        console.log('Token verified, payload:', payload);

        // Add the user info to the request headers
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('user', JSON.stringify(payload));

        // Return the request with modified headers
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    } catch (error) {
        console.error('Token verification failed:', error);
        // Clear the invalid token
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        return response;
    }
}

export const config = {
    matcher: ['/teacher/:path*', '/student/:path*'],
};