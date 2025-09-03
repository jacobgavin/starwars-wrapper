import { unique } from "./utils/lodash.js";

const requestedMovieIdsPerUser = new Map<string, number[]>();

export function movieIdsForUser(
  movieId: number | undefined,
  sessionCookie: string | undefined
): number[] {
  if (movieId) {
    return [movieId];
  }
  if (sessionCookie) {
    return requestedMovieIdsPerUser.get(sessionCookie) ?? [];
  }

  return [];
}

export function setMovieIdsForUser(sessionCookie: string, movieId: number) {
  const movieIdsForUser = requestedMovieIdsPerUser.get(sessionCookie);
  const movieIds = Array.isArray(movieIdsForUser)
    ? unique([...movieIdsForUser, movieId])
    : [movieId];

  requestedMovieIdsPerUser.set(sessionCookie, movieIds);
}
