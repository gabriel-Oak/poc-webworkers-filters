/* eslint-disable no-eval */
/* eslint-disable no-restricted-globals */
import { Filters } from "../types/filter";
import { Pokemon } from "../types/pokemon";
export interface InitAction {
  type: 'INIT',
  pokemons: Pokemon[];
  filterByName: string;
  filterByType: string;
}

export interface FilterAction {
  type: 'FILTER',
  filters: Filters
}
export interface FilterWorkerData {
  data: InitAction | FilterAction;
}

type filterFunction = (filter: string, pokemons: Pokemon[]) => Pokemon[];

const filterWorker = () => {
  console.log('log0');

  let pokemons = [] as Pokemon[];
  let filterByName: filterFunction;
  let filterByType: filterFunction;

  const init = ({
    pokemons: p,
    filterByName: fName, 
    filterByType: fType
  }: InitAction) => {
    console.log('log2', p);

    pokemons = p;
    filterByName = eval(fName);
    filterByType = eval(fType);
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
    console.log('log1', data);

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