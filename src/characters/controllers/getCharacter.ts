import { starwarsService } from "../../services/starwarsService.js";

export default async function getCharacter(id: number) {
  const character = await starwarsService.characterById(id);
  const movies = await Promise.all(
    character.films.map((url) => {
      return starwarsService.filmById(getIdFromUrl(url));
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
  console.log(
    "MOVIES __> ",
    movies.map((movie) => ({
      title: movie.title,
      release: movie.release_date,
      episode_id: movie.episode_id,
    }))
  );

  return {
    height: character.height,
    mass: character.mass,
    gender: character.gender,
    movies: movies.map((movie) => movie.title),
  };
}

function getIdFromUrl(url: string): number {
  const parts = url.split("/");
  if (url.endsWith("/")) {
    return parseInt(parts[parts.length - 2], 10);
  }
  return parseInt(parts[parts.length - 1]);
}
