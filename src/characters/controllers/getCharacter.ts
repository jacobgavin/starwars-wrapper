import { starwarsService } from "../../services/starwarsService.js";
import type { CharacterDetail } from "../Character.js";

export default async function getCharacter(
  id: number
): Promise<CharacterDetail> {
  const character = await starwarsService.peopleById(id);
  const movies = await Promise.all(
    character.films.map((url) => {
      return starwarsService.filmById(starwarsService.getIdFromUrl(url));
    })
  );

  movies.sort((a, b) => {
    if (a.episode_id < b.episode_id) {
      return -1;
    }
    if (a.episode_id > b.episode_id) {
      return 1;
    }
    return 0;
  });

  return {
    name: character.name,
    homeworld: character.homeworld,
    height: character.height,
    mass: character.mass,
    gender: character.gender,
    movies: movies.map((movie) => movie.title),
  };
}
