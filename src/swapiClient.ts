import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

type Paths = "films" | `films/${number}` | string;

const baseUrl = "https://ci-swapi.herokuapp.com/api";

const cache: Map<string, Promise<any>> = new Map();

class SwapiClient {
  url(path: Paths) {
    if (path.includes(baseUrl)) {
      return path;
    }
    return `${baseUrl}/${path}`;
  }

  async fetch(path: Paths) {
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
}

export const swapiClient = new SwapiClient();
