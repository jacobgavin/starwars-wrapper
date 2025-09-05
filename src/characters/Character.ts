export type Character = {
  name: string;
  homeworld: string;
};

export type CharacterDetail = Character & {
  height: number;
  mass: number;
  gender: string;
  movies: string[];
};
