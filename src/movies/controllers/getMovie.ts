import { swapiClient } from "../../swapiClient.js";
import type { MovieDetail } from "../Movie.js";

export default async function getMovie(movieId: number): Promise<MovieDetail> {
  const movie = await swapiClient.fetch(`films/${movieId}`);
  const characters = await Promise.all(
    movie.characters.map((characterUrl: string) =>
      swapiClient.fetch(characterUrl)
    )
  );
  const planets = await Promise.all(
    movie.planets.map((planetUrl: string) => swapiClient.fetch(planetUrl))
  );
  const starships = await Promise.all(
    movie.starships.map((starshipUrl: string) => swapiClient.fetch(starshipUrl))
  );

  return {
    title: movie.title,
    episode_id: movie.episode_id,
    release_date: movie.release_date,
    characters: characters.map((character) => character.name),
    planets: planets.map((planet) => planet.name),
    starships: starships.map((starship) => starship.name),
  };
}
