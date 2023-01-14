[Versão em português](https://www.tabnews.com.br/gabrielOak/performance-tuning-em-reactjs)

You are working in a ReactJs project, codebase looks okay and everything is fine.
But for some weird reason, the application presents slowness, and just the bundle
optimization plugins are being enough. Wath did you do?

## Hello World! I'm Gabriel Carvalho
FrontEnd developer since 2019.                          
Passionate for technology and what I do.

[Github](https://github.com/gabriel-Oak/) [LinkedIn](https://www.linkedin.com/in/gabriel-carvalho-costa) [Instagram](https://www.instagram.com/gabriel_oakcoast/)

## Why optimizing?
Lets begin with a questioning. After all the app is already in production. My work is done, now it's just maintenance right? 
Well, I hope that you don't get to the point of mandatory review your app performance. But if it's you case, or do you
simply is interested in improving a bit of your user's experience, that article may help.

## Rendering
Do you know how React renders its components?

Whenever the props(that arguments passed by father components), or the components own state changes, React rebuild that fella, AND
all its tree.

That is, if you have a tree of 3 nodes and the first one re-render, its child, and the next descendant are submitted to the rendering circle.

In an giant application that it's components and hooks are not well planned, that can turn into a mess of circle of rendering and data
flowing through any direction really really fast.

## How do we put out the fire?
We're going to use React DevTools to identify leaks in the rendering process.

![](https://www.rbsdirect.com.br/filestore/5/3/5/4_00fe3c60dfc0ec0/4535_9b658c573c2ceee.jpg?w=460)

### We have a simple app
```tsx
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
```

```tsx
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
```

```tsx
const Filter: FC = () => {
  const { form, onSubmit } = useFilter();

  return (
    <form onSubmit={onSubmit} className="filter-form">
      <input placeholder='Nome' {...form.register('name')} />
      <input placeholder='Tipo' {...form.register('type')} />
      <button type='submit'> Buscar</button>
    </form>
  );
}

export default Filter;
```

#### Notice that the initial rendering loads all our cards
![](https://github.com/gabriel-Oak/poc-webworkers-filters/blob/main/images/Screenshot%20from%202022-11-29%2019-00-18.png?raw=true)

#### When I search for grass pokemons
![](https://github.com/gabriel-Oak/poc-webworkers-filters/blob/main/images/Screenshot%20from%202022-11-29%2019-17-29.png?raw=true)

# Did you realised?
Even that bubassour's card hasn't came out the screen, it renders again, AND ALL GRASS POKÉMONS TOO

## The use of React.memo
The “memo” is a Higher Order Component, wich tells React that that component passed to it, must be memoized. 

That way React does a little initial effort to memoize the component, avoiding future unnecessary rebuild.

```tsx
export default memo(PokeCard);
```

#### Note that now we haven't any new render
![](https://github.com/gabriel-Oak/poc-webworkers-filters/blob/main/images/Screenshot%20from%202022-11-29%2019-18-13.png?raw=true)

#### When I remove the filter, only the cards that wasn't in the screen suffer changes
![](https://github.com/gabriel-Oak/poc-webworkers-filters/blob/main/images/Screenshot%20from%202022-11-29%2019-18-35.png?raw=true)

## 20,5 ms
Before memo

## 2,9 ms
After memo

## So, it's just using memo everywhere 
Right?

# Wrong
We must be very careful using memo, because it requires more processing from the client's machine to memoise components.

Beside that is very useful when our component is rebuild without any props changing, it isn't quite effective in components
that changes a lot, as PokeList doe so. A memo there would only turn our app heavy unnecessarily. 

And when we have tons of components in our application, we must analyze wizely before got memorizing everything.

## Okay, but what about useMemo?
We may use the "useMemo" to memorize heavy processing and event lists of components. Taking the same careful, because useMemo
also requires processing to do this memoize.

In case of our ```<PokeList />``` had another elements that trigger rendering, whit no need to affect our pokemons, we could use 
useMemo to memorize our cards, “by passing” the ```<PokeList />```'s rendering, triggered by other stuff(props, hooks, etc).

```tsx
const PokeList: FC = () => {
  const { loadingRowList, pokemons } = usePokeList();
  const { pokemonsToShow } = useFilter();

  const cardList = useMemo(() => pokemons
    .map((pokemon) => pokemonsToShow.includes(pokemon.name) && (
      <PokeCard
        key={pokemon.name}
        pokemon={pokemon}
      />
    )), [pokemons, pokemonsToShow]);

  return (
    <section className='pokelist'>
      {loadingRowList ? (
        <p className='loading'>Carregando Pokemons</p>
      ) : cardList}
    </section>
  );
}
```

## Custom memo
It is possible too pass a function that validate the props and return a boolean in reason that React either rebuild 
or not our component.

```tsx
export default memo(PokeCard, (
  prevProps: Readonly<PokeCardProps>,
  nextProps: Readonly<PokeCardProps>,
) => {
  return JSON.stringify(prevProps.pokemon) !== JSON.stringify(nextProps.pokemon)
});
```

## Infinite scroll
Another technique we may use is the “infinite scroll”.

It consist into basically limit the amount of showing items in screen, and load more only when needed.

In other words, the user get near to the page end, new items are feed to him.

### Implementation Example
```tsx
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
```

```tsx
useEffect(() => {
    window?.addEventListener('scroll', onScroll);
    return () => window?.removeEventListener('scroll', onScroll);
}, [onScroll]);
```

```tsx
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
```

## Bônus
We briefly discussed about memorizing here. But there are many more topics that may be interesting to you

![](https://github.com/gabriel-Oak/poc-webworkers-filters/blob/main/images/Screenshot%20from%202022-11-29%2019-19-31.png?raw=true)

## Try too
* React.lazy and code splitting
* WebWorkers
* Data flow management libraries (Redux, MobX, BLoC)

# Thank You!
Any doubt?
You can find me in:

[Github](https://github.com/gabriel-Oak/) [LinkedIn](https://www.linkedin.com/in/gabriel-carvalho-costa) [Instagram](https://www.instagram.com/gabriel_oakcoast/)

## Credits
Special thanks to Mariana, for putting up with me talking about code for hours and being my proofreader

[Powerpoint Presentation(Portuguese)](https://docs.google.com/presentation/d/1klB8fYZAVymbm-VNF3Dzl31KzjSuOUer5phUwe7gE9E/edit?usp=sharing)

[Link to the project](https://github.com/gabriel-Oak/poc-webworkers-filters/)