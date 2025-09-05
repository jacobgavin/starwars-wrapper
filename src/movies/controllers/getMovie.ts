import { starwarsService } from "../../services/starwarsService.js";
import type { MovieDetail } from "../Movie.js";

export default async function getMovie(movieId: number): Promise<MovieDetail> {
  const film = await starwarsService.filmById(movieId);

  const [characters, planets, starships] = await Promise.all([
    starwarsService.getMovieDetails(film, "characters"),
    starwarsService.getMovieDetails(film, "planets"),
    starwarsService.getMovieDetails(film, "starships"),
  ]);

  return {
    title: film.title,
    episode_id: film.episode_id,
    release_date: film.release_date,
    characters: characters.map((character) => character.name),
    planets: planets.map((planet) => planet.name),
    starships: starships.map((starship) => starship.name),
  };
}
