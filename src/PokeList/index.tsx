import React, { FC, useMemo } from 'react';
import { useFilter } from '../Filter/FilterContext';
import PokeCard from './PokeCard';
import { usePokeList } from './PokeListContex';

const PokeList: FC = () => {
  const { loadingRowList, pokemons } = usePokeList();
  const { pokemonsToShow, amountToShow } = useFilter();

  const cardList = useMemo(() => pokemons
    .slice(0, amountToShow)
    .map((pokemon) => pokemonsToShow.includes(pokemon.name) && (
      <PokeCard
        key={pokemon.name}
        pokemon={pokemon}
      />
    )), [pokemons, pokemonsToShow, amountToShow]);

  return (
    <section className='pokelist'>
      {loadingRowList ? (
        <p className='loading'>Carregando Pokemons</p>
      ) : cardList}
    </section>
  );
}

export default PokeList;