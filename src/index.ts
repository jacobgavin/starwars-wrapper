import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { logger } from "hono/logger";
import findCharacters from "./characters/controllers/findCharacters.js";
import { getCookie, setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { SESSION_COOKIE } from "./variables.js";
import movies from "./routes/Movies.routes.js";
import characters from "./routes/Characters.routes.js";

const app = new Hono();

app.use(logger());

app.use("*", (c, next) => {
  const sessionCookie = getCookie(c, SESSION_COOKIE);
  console.log({ sessionCookie });
  if (!sessionCookie) {
    setCookie(c, SESSION_COOKIE, crypto.randomUUID());
  }

  return next();
});

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    return error.getResponse();
  }

  return c.json({ message: "Internal server error" }, 500);
});

app.route("/movies", movies);
app.route("/characters", characters);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

export { app };
