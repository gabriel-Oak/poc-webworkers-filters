import React, { FC } from 'react';
import { useFilter } from '../Filter/FilterContext';
import PokeCard from './PokeCard';
import { usePokeList } from './PokeListContex';

const PokeList: FC = () => {
  const { loadingRowList, pokemons } = usePokeList();
  const { pokemonsToShow } = useFilter();
  
  return (
    <section className='pokelist'>
      {loadingRowList ? (
        <p className='loading'>Carregando Pokemons</p>
      ) : pokemons.map((pokemon) => pokemonsToShow.includes(pokemon.name) && (
        <PokeCard
          key={pokemon.name}
          pokemon={pokemon}
        />
      ))}
    </section>
  );
}

export default PokeList;