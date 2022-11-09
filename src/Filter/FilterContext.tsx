import React, { createContext, FC, useContext, useEffect, useState } from "react";
import { usePokeList } from "../PokeList/PokeListContex";
import { useForm, UseFormReturn } from 'react-hook-form';
import { Filters } from "../types/filter";
import WorkerBuilder from "../services/worker-builder";
import filterWorker from "../services/filter-worker";

const filterJob = new WorkerBuilder(filterWorker);

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

  const onSubmit = form.handleSubmit((filters: Filters) => filterJob.postMessage({
    filters,
    pokemons
  }));

  useEffect(() => {
    filterJob.onmessage = (message) => message && setPokemonsToShow(message.data);
  }, []);

  useEffect(() => {
    const newList: string[] = [];
    pokemons.forEach((p) => newList.push(p.name));
    setPokemonsToShow(newList);
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
