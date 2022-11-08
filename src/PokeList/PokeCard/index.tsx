import React, { FC } from 'react';
import { Pokemon } from '../../types/pokemon';

interface PokeCardProps {
  pokemon: Pokemon;
}

const PokeCard: FC<PokeCardProps> = ({
  pokemon
}) => {
  return (
    <article className='pokecard'>
      <img src={pokemon.sprites.front_default} alt="" />

      <div>
        <header>
          <h1 className='pokeName'>
            {pokemon.name}
          </h1>
        </header>

        <section className='stats'>        
          {pokemon.stats.map((stat) => (
            <p key={stat.stat.name} className="pokeName">
              {`${stat.stat.name}: `} <strong>{stat.base_stat}</strong>
            </p>
          ))}
        </section>
      </div>
    </article>
  );
}

export default PokeCard;