import { starwarsService } from "../../services/starwarsService.js";
import type { Movie } from "../Movie.js";
import type { MovieSort } from "../validators.js";

export default async function findMovies(sort?: MovieSort): Promise<Movie[]> {
  const movies = await starwarsService.films();

  if (sort) {
    sortMovies(movies, sort);
  }

  return movies.map((movie) => ({
    title: movie.title,
    episode_id: movie.episode_id,
    release_date: movie.release_date,
  }));
}

const sortFieldMap = {
  release: "release_date",
  episode: "episode_id",
} as const;

function sortMovies(movies: Movie[], { field, order }: MovieSort) {
  if (!field) {
    return;
  }
  const descending = order === "descending";
  movies.sort((a, b) => {
    const fieldName = sortFieldMap[field];
    if (a[fieldName] > b[fieldName]) {
      return descending ? -1 : 1;
    }
    if (b[fieldName] > a[fieldName]) {
      return descending ? 1 : -1;
    }
    return 0;
  });
}
