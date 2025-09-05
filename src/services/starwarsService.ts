import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { Movie } from "../movies/Movie.js";

const BASE_URL = "https://ci-swapi.herokuapp.com/api";

const cache: Map<string, Promise<any>> = new Map();

class StarwarsService {
  private url(path: string) {
    if (path.includes(BASE_URL)) {
      return path;
    }
    return `${BASE_URL}/${path}`;
  }

  private async fetch(path: string) {
    const url = this.url(path);
    let promise = cache.get(url);

    if (!promise) {
      promise = fetch(url).then((response) => {
        if (!response.ok) {
          throw new HTTPException(response.status as ContentfulStatusCode, {
            res: response,
          });
        }
        return response.json();
      });
      cache.set(url, promise);
    }
    return promise;
  }

  async films(): Promise<Film[]> {
    const response = await this.fetch("films");
    return response.results;
  }

  async filmById(id: number): Promise<Film> {
    return this.fetch(`films/${id}`);
  }

  async getMovieDetails(
    movie: Film,
    key: keyof Pick<Film, "characters" | "planets" | "starships">
  ): Promise<Detail[]> {
    return Promise.all(movie[key].map((url) => starwarsService.get(url)));
  }

  async characterById(id: number): Promise<People> {
    return this.fetch(`people/${id}`);
  }

  async get(url: string) {
    return this.fetch(url);
  }
}

export const starwarsService = new StarwarsService();

type Film = {
  title: string;
  episode_id: number;
  release_date: string;
  starships: string[];
  characters: string[];
  planets: string[];
};

type Detail = {
  name: string;
};

type People = {
  height: number;
  mass: number;
  gender: string;
  films: string[];
};
