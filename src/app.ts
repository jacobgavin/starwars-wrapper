import { Hono } from "hono";
import { logger } from "hono/logger";
import { getCookie, setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { etag } from "hono/etag";

import { SESSION_COOKIE } from "./variables.js";
import movies from "./movies/movies.routes.js";
import characters from "./characters/characters.routes.js";

const app = new Hono();

app.use(logger());

app.use("*", (c, next) => {
  const sessionCookie = getCookie(c, SESSION_COOKIE);
  if (!sessionCookie) {
    setCookie(c, SESSION_COOKIE, crypto.randomUUID());
  }

  return next();
});

app.get("*", etag());

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    return error.getResponse();
  }

  return c.json({ message: "Internal server error" }, 500);
});

app.route("/movies", movies);
app.route("/characters", characters);

export { app };
