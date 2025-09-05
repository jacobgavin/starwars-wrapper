import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import type { Character } from "../src/characters/Character.js";

describe("Characters API", () => {
  it("GET /characters returns empty array when no previous movies have been fetched", async () => {
    const res = await app.request("/characters");
    expect(res.status).toBe(200);
    const response = await res.json();
    expect(response).to.be.an("array").that.is.empty;
  });

  it("GET /characters returns characters for movie id param", async () => {
    const res = await app.request("/characters?movie=1");
    await expectCharacterResponse(res);
  });

  it("GET /characters returns characters from movies previously fetched", async () => {
    const movie1 = await app.request("/movies/1");
    expect(movie1.status).toBe(200);

    const headers = makeSessionIdHeader(movie1);
    const characters1 = await app.request("/characters", {
      headers,
    });
    const firstResponse = await expectCharacterResponse(characters1);

    const movie2 = await app.request("/movies/3", { headers });
    expect(movie2.status).toBe(200);

    const characters2 = await app.request("/characters", {
      headers,
    });
    const secondResponse = await expectCharacterResponse(characters2);
    expect(firstResponse).to.have.length.below(secondResponse.length);
  });

  it("GET /characters/:id returns character with movies in chronological order", async () => {
    const res = await app.request("/characters/1");
    expect(res.status).toBe(200);
    const character = await res.json();

    expect(character.name).toEqual("Luke Skywalker");
    expect(character.homeworld).toEqual("Tatooine");
    expect(character.height).toEqual("172");
    expect(character.mass).toEqual("77");
    expect(character.gender).toEqual("male");
    expect(character.movies).toEqual([
      "Revenge of the Sith",
      "A New Hope",
      "The Empire Strikes Back",
      "Return of the Jedi",
    ]);
  });
});

async function expectCharacterResponse(res: Response): Promise<Character[]> {
  expect(res.status).toBe(200);
  const characters = await res.json();
  expect(characters).to.be.an("array").that.is.not.empty;
  expect(characters[0]).to.have.property("name").that.is.a("string");
  expect(characters[0]).to.have.property("homeworld").that.is.a("string");
  characters.forEach((character: any) => {
    expect(character.homeworld).not.toMatch(/https/i);
  });
  return characters;
}

function makeSessionIdHeader(res: Response) {
  const sessionCookie = res.headers.getSetCookie()[0].split(";")[0];
  const headers = new Headers();
  headers.append("Cookie", sessionCookie);
  return headers;
}
