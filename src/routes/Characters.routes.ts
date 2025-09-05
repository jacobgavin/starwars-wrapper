import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import z from "zod";
import { SESSION_COOKIE } from "../variables.js";
import findCharacters from "../characters/controllers/findCharacters.js";
import { movieIdsForUser } from "../moviesPerUserCache.js";
import getCharacter from "../characters/controllers/getCharacter.js";

const app = new Hono();

app.get(
  "/",
  zValidator("query", z.object({ movie: z.coerce.number().optional() })),
  async (c) => {
    const { movie: movieId } = c.req.valid("query");
    const sessionCookie = getCookie(c, SESSION_COOKIE);
    const characters = await findCharacters(
      movieIdsForUser(movieId, sessionCookie)
    );

    return c.json(characters);
  }
);
app.get(
  "/:id",
  zValidator("param", z.object({ id: z.coerce.number() })),
  async (c) => {
    const { id } = c.req.valid("param");

    const character = await getCharacter(id);
    return c.json(character);
  }
);

export default app;
