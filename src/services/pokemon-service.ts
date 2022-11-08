import axios from 'axios';
import { GenericItem, Pokemon } from '../types/pokemon';

const client = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
});

client.interceptors.response.use(({ data }) => data, console.error);

const pokemonService = {
  getPokemons: (): Promise<{ results: GenericItem[] }> => client
    .get('/pokemon?limit=100&offset=0'),
  getPokemonInfo: (pokemon: string): Promise<Pokemon> => client
    .get(`pokemon/${pokemon}`),
}

export default pokemonService;
