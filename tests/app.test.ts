import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";

describe("App", () => {
  it.only("sets e-tag on request", async () => {
    const res = await app.request("/movies/1");
    expect(res.status).toEqual(200);
    const etag = res.headers.get("etag");
    expect(etag).to.be.a("string");

    const etagRes = await app.request("/movies/1");
    expect(etagRes.status).toEqual(200);
    const etag2 = etagRes.headers.get("etag");
    expect(etag2).to.be.a("string");
    expect(etag).toEqual(etag2);
  });
});
