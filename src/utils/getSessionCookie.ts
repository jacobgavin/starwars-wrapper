import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import { SESSION_COOKIE } from "../variables.js";

export function getSessionCookie(c: Context): string | undefined {
  const cookie = getCookie(c, SESSION_COOKIE);
  if (cookie) {
    return cookie;
  }
  return getSessionCookieSetInSameSession(c);
}

function getSessionCookieSetInSameSession(c: Context): string | undefined {
  const setCookies = c.res.headers.getSetCookie();
  const sessionCookie = setCookies.filter((cookie) =>
    cookie.startsWith(SESSION_COOKIE)
  );
  if (sessionCookie.length === 1) {
    return sessionCookie[0].split(";")[0].split("=")[1];
  }
}
