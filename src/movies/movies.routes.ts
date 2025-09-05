import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { getSessionCookie } from "../utils/getSessionCookie.js";
import findMovies from "./controllers/findMovies.js";
import getMovie from "./controllers/getMovie.js";
import { movieSortOrderSchema } from "./validators.js";
import { setMovieIdsForUser } from "../moviesPerUserCache.js";

const app = new Hono();

app.get(
  "/",
  zValidator("query", movieSortOrderSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          message: z.prettifyError(result.error),
        },
        400
      );
    }
  }),
  async (c) => {
    const query = c.req.valid("query");
    const movies = await findMovies(query);
    return c.json(movies);
  }
);

app.get(
  "/:id",
  zValidator("param", z.object({ id: z.coerce.number() })),
  async (c) => {
    const movieId = c.req.valid("param").id;
    const movie = await getMovie(movieId);

    const sessionCookie = getSessionCookie(c);
    if (sessionCookie) {
      setMovieIdsForUser(sessionCookie, movieId);
    }

    return c.json(movie);
  }
);

export default app;
