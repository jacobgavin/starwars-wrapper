import { swapiClient } from "../swapiClient.js";
import type { Character } from "./Character.js";

export default async function findCharacters(movieIds: number[]): Promise<Character[]> {
    const movies = await Promise.all(
        movieIds.map(movieId => swapiClient.fetch(`films/${movieId}`))
    );

    console.log(movies);
    const characterUrls = movies.map(movie => movie.characters).flat();
    const characters = await Promise.all(
        unique(characterUrls).map(url => swapiClient.fetch(url))
    )

    return characters.map(character => ({
        name: character.name,
        homeworld: character.homeworld
    }))
}

function unique(values: string[]): string[] {
    return [...new Set(values)]
}