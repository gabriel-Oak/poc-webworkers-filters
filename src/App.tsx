import { FC } from 'react';
import { PokeListProvider } from './PokeList/PokeListContex';

import './App.css';
import PokeList from './PokeList';
import { FilterProvider } from './Filter/FilterContext';
import Filter from './Filter';

const App: FC = () => (
  <PokeListProvider>
    <FilterProvider>
      <main className="App">
        <header className="App-header">
          <h1>
            POCKEMÓNS
          </h1>
        </header>

        <Filter />

        <PokeList />
      </main>
    </FilterProvider>
  </PokeListProvider>
);

export default App;
