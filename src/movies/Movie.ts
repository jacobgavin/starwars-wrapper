export type Movie = {
    title: string;
    episode_id: number;
    release_date: string
}

export type MovieDetail = Movie & {
    characters: string[];
    planets: string[];
    starships: string[];
}

