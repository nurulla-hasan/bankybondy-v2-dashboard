import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  isAdminRole,
  isAuthRoute,
  USER_HOME,
} from "@/constants";
import { verifyAccessToken } from "@/lib/jwt";

const REFRESH_BEFORE_EXPIRY = 5 * 60;

function backendUrl() {
  return (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:5000/api/v1"
  ).replace(/\/$/, "");
}

async function refreshAccessToken(
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken?: string } | null> {
  try {
    const res = await fetch(`${backendUrl()}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `${REFRESH_COOKIE_NAME}=${refreshToken}`,
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();

    return data?.data?.accessToken ? data.data : null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const accessToken = request.cookies.get(ACCESS_COOKIE_NAME)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;

  let session = verifyAccessToken(accessToken);
  let issued: { accessToken: string; refreshToken?: string } | null = null;

  const expiringSoon =
    Boolean(session?.exp) &&
    session!.exp! - Math.floor(Date.now() / 1000) <= REFRESH_BEFORE_EXPIRY;

  if (refreshToken && (!session || expiringSoon)) {
    issued = await refreshAccessToken(refreshToken);
    if (issued) session = verifyAccessToken(issued.accessToken);
  }

  const isAdmin = Boolean(session && isAdminRole(session.role));

  let response: NextResponse;

  if (isAuthRoute(pathname)) {
    // Admin already signed in: skip the login screen. Members may stay here so
    // the form is reachable and the "no admin access" note can be shown.
    response = isAdmin
      ? NextResponse.redirect(new URL(USER_HOME, request.url))
      : NextResponse.next();
  } else if (!isAdmin) {
    const loginUrl = new URL("/login", request.url);

    if (session) loginUrl.searchParams.set("error", "forbidden");
    else loginUrl.searchParams.set("callbackUrl", pathname + search);

    response = NextResponse.redirect(loginUrl);
  } else {
    response = NextResponse.next();
  }

  if (issued) {
    const refreshed = verifyAccessToken(issued.accessToken);
    const maxAge = refreshed?.exp
      ? Math.max(refreshed.exp - Math.floor(Date.now() / 1000), 0)
      : undefined;

    response.cookies.set(ACCESS_COOKIE_NAME, issued.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    if (issued.refreshToken) {
      response.cookies.set(REFRESH_COOKIE_NAME, issued.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }
  }

  return response;
}

export default proxy;

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml|assets|.*\\..*).*)",
  ],
};
