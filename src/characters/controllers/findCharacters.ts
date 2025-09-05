import { starwarsService } from "../../services/starwarsService.js";
import { unique } from "../../utils/lodash.js";
import type { Character } from "../Character.js";

export default async function findCharacters(
  movieIds: number[]
): Promise<Character[]> {
  const movies = await Promise.all(
    movieIds.map((movieId) => starwarsService.filmById(movieId))
  );

  const characterUrls = movies.map((movie) => movie.characters).flat();
  const characters = await Promise.all(
    unique(characterUrls).map((url) =>
      starwarsService.peopleById(starwarsService.getIdFromUrl(url))
    )
  );

  return characters.map((character) => ({
    name: character.name,
    homeworld: character.homeworld,
  }));
}
