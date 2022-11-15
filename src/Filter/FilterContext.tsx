/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, FC, useContext, useEffect, useState } from "react";
import { usePokeList } from "../PokeList/PokeListContex";
import { useForm, UseFormReturn } from 'react-hook-form';
import { Filters } from "../types/filter";
// import WorkerBuilder from "../services/worker-builder";
// import filterWorker from "../services/filter-worker";
import { Pokemon } from "../types/pokemon";

const filterByName = (name: string, pokemons: Pokemon[]) => pokemons
  .filter((pokemon) => pokemon.name.includes(name))

const filterByType = (type: string, pokemons: Pokemon[]) => pokemons
  .filter((pokemon) => pokemon.types
    .some((t) => t.type.name.includes(type)));

const filter = (filters: Filters, pokemons: Pokemon[]) => {
  const name = filters.name.toLowerCase();
  const type = filters.type.toLowerCase();
  let newPokemonsToShow = Array.from(pokemons);
  if (name) newPokemonsToShow = filterByName(name, newPokemonsToShow);
  if (type) newPokemonsToShow = filterByType(type, newPokemonsToShow);

  return newPokemonsToShow.map(({ name }) => name);
}

// const filterJob = new WorkerBuilder(filterWorker);

export interface FilterContextProps {
  pokemonsToShow: string[];
  form: UseFormReturn<Filters>;
  onSubmit: (e?: React.BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>;
}

export const FilterContext = createContext(null as unknown as FilterContextProps);

export const FilterProvider: FC<{
  children: JSX.Element
}> = ({ children }) => {
  const { pokemons } = usePokeList();
  const form = useForm<Filters>();
  const [pokemonsToShow, setPokemonsToShow] = useState([] as string[]);

  const onSubmit = form.handleSubmit((filters: Filters) =>
    setPokemonsToShow(filter(filters, pokemons)));

  // const onSubmit = form.handleSubmit((filters: Filters) => filterJob
  //   .postMessage({ type: 'FILTER', filters }));

  useEffect(() => {
    // filterJob.onmessage = (message) => message && setPokemonsToShow(message.data);
    // filterJob.postMessage({ type: 'INIT', pokemons });
    // filterJob.postMessage({
    //   type: 'FILTER',
    //   filters: { name: '', type: '' },
    // });
    setPokemonsToShow(pokemons.map(({name}) => name));
    form.reset();
  }, [pokemons]);

  return (
    <FilterContext.Provider value={{
      pokemonsToShow,
      form,
      onSubmit
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export const useFilter = () => useContext(FilterContext);
