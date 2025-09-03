import { describe, expect, it, test } from "vitest";
import { app } from "./index.js";

describe("Movies", () => {
  it("GET /movies", async () => {
    const res = await app.request("/movies");
    expect(res.status).toBe(200);
    const movies = await res.json();
    expect(movies).to.be.an("array");
    movies.forEach((movie: any) => {
      expect(movie).to.have.a.property("title").that.is.a("string");
      expect(movie).to.have.a.property("episode_id").that.is.a("number");
      expect(movie).to.have.a.property("release_date").that.is.a("string");
    });
  });

  it("GET /movies returns error for invalid sort field", async () => {
    const res = await app.request("/movies?field=foobar&order=bar");
    expect(res.status).toBe(400);
    const error = await res.json();
    expect(error).toHaveProperty("success", false);
  });

  it("GET /movies/:id", async () => {
    const res = await app.request("/movies/1");
    expect(res.status).toBe(200);
    const movie = await res.json();
    expect(movie).to.be.an("object");
    expect(movie).to.have.a.property("title").that.is.a("string");
    expect(movie).to.have.a.property("episode_id").that.is.a("number");
    expect(movie).to.have.a.property("release_date").that.is.a("string");
    expect(movie).to.have.a.property("characters").that.is.an("array");
    expect(movie.characters[0]).toEqual("Luke Skywalker");
  });

  it("GET /movies/:id returns an error if movie with id 1337 does not exist", async () => {
    const res = await app.request("/movies/1337");
    expect(res.status).toBe(404);
    const response = await res.json();
    expect(response).toHaveProperty("detail", "Not found");
  });

  it("GET /characters returns empty array when no previous movies have been fetched", async () => {
    const res = await app.request("/characters");
    expect(res.status).toBe(200);
    const response = await res.json();
    expect(response).to.be.an("array").that.is.empty;
  });

  it("GET /characters returns characters for movie id param", async () => {
    const res = await app.request("/characters?movie=1");
    expect(res.status).toBe(200);
    const response = await res.json();
    expect(response).to.be.an("array").that.is.not.empty;
    expect(response[0]).to.have.property("name").that.is.a("string");
    expect(response[0]).to.have.property("homeworld").that.is.a("string");
  });

  it("GET /characters returns characters from movies previously fetched", async () => {
    const movie1 = await app.request("/movies/1");
    expect(movie1.status).toBe(200);

    const sessionCookie = movie1.headers.getSetCookie()[0].split(";")[0];
    const headers = new Headers();
    headers.append("Cookie", sessionCookie);

    const characters1 = await app.request("/characters", {
      headers,
    });

    expect(characters1.status).toBe(200);
    const firstResponse = await characters1.json();
    expect(firstResponse).to.be.an("array").that.is.not.empty;
    expect(firstResponse[0]).to.have.property("name").that.is.a("string");
    expect(firstResponse[0]).to.have.property("homeworld").that.is.a("string");

    const movie2 = await app.request("/movies/3", { headers });
    expect(movie2.status).toBe(200);

    const characters2 = await app.request("/characters", {
      headers,
    });
    const secondResponse = await characters2.json();
    expect(firstResponse).to.have.length.below(secondResponse.length);
  });
});
