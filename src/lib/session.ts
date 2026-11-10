import { cookies } from "next/headers";
import { ACCESS_COOKIE_NAME } from "@/constants";
import { verifyAccessToken } from "./jwt";
import type { Session } from "@/types";

/** Reads the HttpOnly access cookie and returns the verified session, if any. */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();

  return verifyAccessToken(cookieStore.get(ACCESS_COOKIE_NAME)?.value);
}
