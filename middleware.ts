import { auth } from '@/lib/auth';
import type { Session } from 'next-auth';

export default auth(
  (req: { auth: Session | null; nextUrl: URL; url: string }) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    if (nextUrl.pathname.startsWith('/dashboard') && !isLoggedIn) {
      return Response.redirect(new URL('/auth/signin', nextUrl));
    }
  }
);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
