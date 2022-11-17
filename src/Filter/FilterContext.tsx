/* eslint-disable react-hooks/exhaustive-deps */
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
  amountToShow: number;
  onSubmit: (e?: React.BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>;
}

export const FilterContext = createContext(null as unknown as FilterContextProps);

export const FilterProvider: FC<{
  children: JSX.Element
}> = ({ children }) => {
  const { pokemons } = usePokeList();
  const form = useForm<Filters>();
  const [amountToShow, setAmountToShow] = useState(30);
  const [pokemonsToShow, setPokemonsToShow] = useState([] as string[]);
  const [scrollTimeout, setScrollTimeout] = useState(null as unknown as NodeJS.Timeout);

  const onScroll = () => {
    const scrolledToBottom =
      window?.innerHeight + Math.ceil(window?.pageYOffset) + 300 >=
      document?.body.offsetHeight;

    const haveMoreToShow = amountToShow < (pokemonsToShow?.length);

    if (scrolledToBottom && haveMoreToShow) {
      if (scrollTimeout) clearTimeout(scrollTimeout);

      setScrollTimeout(
        setTimeout(() => {
          setAmountToShow(amountToShow + 10);
        }, 50),
      );
    }
  };

  const onSubmit = form.handleSubmit((filters: Filters) => filterJob
    .postMessage({ type: 'FILTER', filters }));

  useEffect(() => {
    filterJob.onmessage = (message) => message && setPokemonsToShow(message.data);
    filterJob.postMessage({ type: 'INIT', pokemons });
    filterJob.postMessage({
      type: 'FILTER',
      filters: { name: '', type: '' },
    });
    form.reset();
    setAmountToShow(30);
  }, [pokemons]);

  useEffect(() => {
    window?.addEventListener('scroll', onScroll);
    return () => window?.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  return (
    <FilterContext.Provider value={{
      pokemonsToShow,
      form,
      amountToShow,
      onSubmit
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export const useFilter = () => useContext(FilterContext);
