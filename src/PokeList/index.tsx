import React, { FC } from 'react';
import PokeCard from './PokeCard';
import { usePokeList } from './PokeListContex';

const PokeList: FC = () => {
  const { loadingRowList, pokemons } = usePokeList();
  console.log(pokemons);
  
  return (
    <section className='pokelist'>
      {loadingRowList ? (
        <p className='loading'>Carregando Pokemons</p>
      ) : pokemons.map((pokemon) => (
        <PokeCard
          key={pokemon.name}
          pokemon={pokemon}
        />
      ))}
    </section>
  );
}

export default PokeList;