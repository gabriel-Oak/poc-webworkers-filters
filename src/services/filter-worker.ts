/* eslint-disable no-restricted-globals */
import { Filters } from "../types/filter";
import { Pokemon } from "../types/pokemon";


export interface FilterWorkerData {
  data: {
    pokemons: Pokemon[];
    filters: Filters;
  };
}

const filterWorker = () => {
  self.onmessage = (message: FilterWorkerData) => {
    const { filters, pokemons } = message.data;
    const name = filters.name.toLowerCase();
    const type = filters.type.toLowerCase();

    let newPokemonsToShow = Array.from(pokemons);
    if (name) newPokemonsToShow = newPokemonsToShow
      .filter((pokemon) => pokemon.name.includes(name));

    if (type) newPokemonsToShow = newPokemonsToShow
      .filter((pokemon) => pokemon.types
        .some((t) => t.type.name.includes(type)));

    postMessage(newPokemonsToShow.map(({ name }) => name));
  }
}

export default filterWorker;