import { swapiClient } from "../../swapiClient.js";
import { unique } from "../../utils/lodash.js";
import type { Character } from "../Character.js";

export default async function findCharacters(
  movieIds: number[]
): Promise<Character[]> {
  const movies = await Promise.all(
    movieIds.map((movieId) => swapiClient.fetch(`films/${movieId}`))
  );

  const characterUrls = movies.map((movie) => movie.characters).flat();
  const characters = await Promise.all(
    unique(characterUrls).map((url) => swapiClient.fetch(url))
  );

  return characters.map((character) => ({
    name: character.name,
    homeworld: character.homeworld,
  }));
}
