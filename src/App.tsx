import { FC } from 'react';
import { PokeListProvider } from './PokeList/PokeListContex';

import './App.css';
import PokeList from './PokeList';

const App: FC = () => (
  <PokeListProvider>
    <main className="App">
      <header className="App-header">
        <h1>
          POKEMONS
        </h1>
      </header>

      <PokeList />
    </main>
  </PokeListProvider>
);

export default App;
