import { Pokemon } from "../types/pokemon";

export const filterByName = (name: string, pokemons: Pokemon[]) => pokemons
  .filter((pokemon) => pokemon.name.includes(name))

export const filterByType = (type: string, pokemons: Pokemon[]) => pokemons
  .filter((pokemon) => pokemon.types
    .some((t) => t.type.name.includes(type)));
