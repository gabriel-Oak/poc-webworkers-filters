import React, { createContext, FC, useContext, useEffect, useState } from "react";
import { Pokemon, GenericItem } from '../types/pokemon';
import Swal from "sweetalert2";
import pokemonService from "../services/pokemon-service";

export interface PokeListContextProps {
  loadingRowList: boolean;
  pokemons: Pokemon[];
}

export const PokeListContext = createContext(null as unknown as PokeListContextProps);

export const PokeListProvider: FC<{
  children: JSX.Element
}> = ({ children }) => {
  const [loadingRowList, setLoadingRowList] = useState(false);
  const [pokemons, setPokemons] = useState([] as Pokemon[]);

  const getPokemonInfo = async (name: string) => {
    try {
      const pokemon = await pokemonService.getPokemonInfo(name);
      return pokemon;
    } catch (error) {
      Swal.fire({
        icon: 'warning',
        title: `Erro ao buscar ${name}`,
        text: String(error),
      });
    }
    return null;
  }

  const getAllPokemons = async () => {
    setLoadingRowList(true);
    try {
      const { results } = await pokemonService.getPokemons();
      const pokemonsResults = (await Promise.all(
        results.map((item) => getPokemonInfo(item.name))
      )).filter(Boolean) as Pokemon[];

      setPokemons(pokemonsResults);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao buscar pokemons',
        text: String(error),
      });
    }
    setLoadingRowList(false);
  }

  useEffect(() => {
    getAllPokemons();
  }, []);

  return (
    <PokeListContext.Provider value={{
      loadingRowList,
      pokemons,
    }}>
      {children}
    </PokeListContext.Provider>
  );
}

export const usePokeList = () => useContext(PokeListContext);