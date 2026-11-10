export const AUTH_ROUTES = ["/login"] as const;

export const USER_HOME = "/dashboard" as const;

export const isAuthRoute = (pathname: string) =>
  AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
