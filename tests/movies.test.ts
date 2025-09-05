import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";

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

  describe("sort and order", () => {
    it("GET /movies sort by release and ascending order will return new hope as first", async () => {
      const res = await app.request("/movies?field=release&order=ascending");
      expect(res.status).toBe(200);
      const movies = await res.json();

      expect(movies[0].title).toEqual("A New Hope");
      expect(movies[movies.length - 1].title).toEqual("Revenge of the Sith");
    });

    it("GET /movies sort by release and descending order will return Revenge of the Sith as first", async () => {
      const res = await app.request("/movies?field=release&order=descending");
      expect(res.status).toBe(200);
      const movies = await res.json();

      expect(movies[0].title).toEqual("Revenge of the Sith");
      expect(movies[movies.length - 1].title).toEqual("A New Hope");
    });

    it("GET /movies sort by episode and ascending order will return The Phantom Menace as first", async () => {
      const res = await app.request("/movies?field=episode&order=ascending");
      expect(res.status).toBe(200);
      const movies = await res.json();

      expect(movies[0].title).toEqual("The Phantom Menace");
      expect(movies[movies.length - 1].title).toEqual("Return of the Jedi");
    });

    it("GET /movies sort by episode and descending order will return Return of the Jedi as first", async () => {
      const res = await app.request("/movies?field=episode&order=descending");
      expect(res.status).toBe(200);
      const movies = await res.json();

      expect(movies[0].title).toEqual("Return of the Jedi");
      expect(movies[movies.length - 1].title).toEqual("The Phantom Menace");
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
});
