import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { movieSortOrderSchema } from './movies/validators.js'
import { zValidator } from '@hono/zod-validator'
import findMovies from './movies/findMovies.js'
import z from 'zod'
import getMovie from './movies/getMovie.js'
import { logger } from 'hono/logger'
import findCharacters from './characters/findCharacters.js'

const app = new Hono()

app.use(logger());

// curl http://localhost:3000/movies | jq
// curl http://localhost:3000/movies\?field\=release\&order\=ascending | jq
app.get(
  '/movies',
  zValidator('query', movieSortOrderSchema, (result, c) => {
    if (!result.success) {
      return c.json({
        success: false,
        message: z.prettifyError(result.error)
      }, 400)
    }
  }),
  async (c) => {
    const query= c.req.valid("query");
    const movies = await findMovies(query)
    return c.json(movies)
  }
)

const requestedMovieIds = new Map<number, boolean>()
// curl http://localhost:3000/movies/1 | jq
app.get(
  '/movies/:id',
  zValidator('param', z.object({ id: z.coerce.number() })),
  async (c) => {
    const movieId = c.req.valid("param").id
    const movie = await getMovie(movieId);
    requestedMovieIds.set(movieId, true);
    return c.json(movie)
  }
)
app.get(
  '/characters',
  zValidator('query', z.object({ movie: z.coerce.number().optional() })),
  async (c) => {
    const {movie: movieId} = c.req.valid("query");

    const movieIds = Array.from(requestedMovieIds.keys())
    
    const characters = await findCharacters(movieId ? [movieId] : movieIds)
    return c.json(characters);
  }
)

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

export { app };