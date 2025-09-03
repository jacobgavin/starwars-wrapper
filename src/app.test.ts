import { describe, expect, it, test } from "vitest"
import { app } from "./index.js"

describe('Movies', () => {
  it('GET /movies', async () => {
    const res = await app.request('/movies')
    expect(res.status).toBe(200)
    const movies = await res.json();
    expect(movies).to.be.an("array");
    movies.forEach((movie: any) => {
        expect(movie).to.have.a.property("title").that.is.a("string");
        expect(movie).to.have.a.property("episode_id").that.is.a("number");
        expect(movie).to.have.a.property("release_date").that.is.a("string");
    })
  })
  
  it('returns error for invalid sort field', async () => {
    const res = await app.request('/movies?field=foobar&order=bar')
    expect(res.status).toBe(400);
    const error = await res.json();
    expect(error).toHaveProperty("success", false);
  })

  it('GET /movies/:id', async () => {
    const res = await app.request('/movies/1')
    expect(res.status).toBe(200)
    const movie = await res.json();
    expect(movie).to.be.an("object");
    expect(movie).to.have.a.property("title").that.is.a("string");
    expect(movie).to.have.a.property("episode_id").that.is.a("number");
    expect(movie).to.have.a.property("release_date").that.is.a("string");
    expect(movie).to.have.a.property("characters").that.is.an("array")
    expect(movie.characters[0]).toEqual("Luke Skywalker");
  })
})
