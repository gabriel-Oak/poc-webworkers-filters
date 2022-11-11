/* eslint-disable no-eval */
/* eslint-disable no-restricted-globals */
import { Filters } from "../types/filter";
import { Pokemon } from "../types/pokemon";
export interface InitAction {
  type: 'INIT',
  pokemons: Pokemon[];
}

export interface FilterAction {
  type: 'FILTER',
  filters: Filters
}
export interface FilterWorkerData {
  data: InitAction | FilterAction;
}

const filterByName = (name: string, pokemons: Pokemon[]) => pokemons
  .filter((pokemon) => pokemon.name.includes(name))

const filterByType = (type: string, pokemons: Pokemon[]) => pokemons
  .filter((pokemon) => pokemon.types
    .some((t) => t.type.name.includes(type)));

const filterWorker = () => {

  let pokemons = [] as Pokemon[];

  const init = ({ pokemons: p }: InitAction) => {
    pokemons = p;
  }

  const filter = (filters: Filters) => {
    const name = filters.name.toLowerCase();
    const type = filters.type.toLowerCase();
    let newPokemonsToShow = Array.from(pokemons);
    if (name) newPokemonsToShow = filterByName(name, newPokemonsToShow);
    if (type) newPokemonsToShow = filterByType(type, newPokemonsToShow);

    return newPokemonsToShow.map(({ name }) => name);
  }

  self.onmessage = ({ data }: FilterWorkerData) => {
    switch (data.type) {
      case 'INIT':
        init(data);
        break;
      case 'FILTER':
        postMessage(filter(data.filters));
        break;
      default:
        throw Error('Type not recocgnized');
    }
  }
}

export default filterWorker;