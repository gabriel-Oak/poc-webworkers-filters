[English version](https://www.tabnews.com.br/gabrielOak/performance-tunning-in-reactjs)

Você está trabalhando em um projeto ReactJS, a codebase parece
okay e tudo segue normalmente. Mas por algum motivo, a aplicação
apresenta lentidão, e os plugins de otimização de bundle não estão
sendo o suficiente. O quê você faz?

## Olá! Eu sou Gabriel Carvalho
Desenvolvedor FrontEnd desde 2019.                          
Apaixonado por tecnologia e o que faço.

[Github](https://github.com/gabriel-Oak/) [LinkedIn](https://www.linkedin.com/in/gabriel-carvalho-costa) [Instagram](https://www.instagram.com/gabriel_oakcoast/)

## Por que otimizar?
Vamos começar com um questionamento. Afinal, o app já está em produção. Meu trabalho acabou, agora é só ficar na sustentação certo?
Bom, espero que você não precise chegar ao ponto de mandatóriamente ter que rever a performance do seu app. Mas se for o seu caso, ou você só está interessado em melhorar um pouco a experiencia do seu usuário, este artigo pode te ajudar.

## Renderização
Você sabe como o React renderiza seus componentes?

Sempre que as props(aqueles argumentos maravilhosos passados pelo componente pai), ou o state do proprio componente mudam, o React força um ciclo de renderização no componente, e toda sua árvore.

Ou seja, se você tem uma hierarquia de 3 componentes, e o primeiro atualiza, o seu filho, e o decendente seguinte são submetidos ao ciclo de renderização.

Em uma aplicação gigante cujos componentes e hooks não tenham sido bem planejados, isso pode virar um fuê de ciclos de atualização e dados tranzitando para lá e para cá rapidinho.

## Como apagamos o incendio então?
Iremos utilizar o React DevTools para identificar gargalos no processo de renderização dos componentes.

![](https://www.rbsdirect.com.br/filestore/5/3/5/4_00fe3c60dfc0ec0/4535_9b658c573c2ceee.jpg?w=460)

### Temos um app simples
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

#### Notem que a renderização inicial carrega todos os cards
![](https://github.com/gabriel-Oak/poc-webworkers-filters/blob/main/images/Screenshot%20from%202022-11-29%2019-00-18.png?raw=true)

#### Quando busco por pokemons de grama
![](https://github.com/gabriel-Oak/poc-webworkers-filters/blob/main/images/Screenshot%20from%202022-11-29%2019-17-29.png?raw=true)

# Percebeu?
Mesmo que o card do Bulbassauro não tenha saído da tela, ele renderizou de novo… E TODOS OS POKÉMONS DE GRAMA

## O uso do React.memo
O “memo” é um Higher Order Component, que diz ao React que, aquele componente que foi passado para ele, deve ser memorizado. 

Assim o React faz um pequeno esforço incial extra para memorizar o componente, evitando que no futuro aquele item seja recriado desnecessariamente.

```tsx
export default memo(PokeCard);
```

#### Note que agora não houve nenhum renderização nova
![](https://github.com/gabriel-Oak/poc-webworkers-filters/blob/main/images/Screenshot%20from%202022-11-29%2019-18-13.png?raw=true)

#### Quando retiro o filtro, agora só surgem os cards que não estavam
![](https://github.com/gabriel-Oak/poc-webworkers-filters/blob/main/images/Screenshot%20from%202022-11-29%2019-18-35.png?raw=true)

## 20,5 ms
Antes do memo

## 2,9 ms
Após o memo

## É só usar memo em tudo 
Certo?

# Errado
Devemos ter muito cuidado com o uso do memo, pois ele exige mais da máquina para fazer essa memorização.

Apesar de isso ser muito util quando nosso componente é recriado sem alteração nas props.

Ele não é efetivo em componentes que atualizam muito, como PokeList. Um memo ali só tornaria nosso app um pouco mais pesado sem necessidade.

E quando temos milhares de componente em nossa aplicação, precisamos analizar com cuidado antes de sair memorizando tudo.

## Tá mas e o useMemo?
Podemos também utilizar o hook “useMemo” para fazer a memorização de cálculos pesados e até mesmo listas de componentes.
Tomando o mesmo cuidado, pois useMemo também exige um pouco mais para fazer essa memorização.

Caso nosso ```<PokeList />``` possuísse outros elementos que desencadeassem renderização, sem necessariamente afetar nossos pokemons, poderíamos usar useMemo para memorizar nossos elementos, “driblando” a renderização de ```<PokeList />``` devido a outros elementos(props, hooks, etc).

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

## Memo personalizado
É possível também passar uma função que valida as props e retorne um booleano para que o react recrie ou não o componente

```tsx
export default memo(PokeCard, (
  prevProps: Readonly<PokeCardProps>,
  nextProps: Readonly<PokeCardProps>,
) => {
  return JSON.stringify(prevProps.pokemon) !== JSON.stringify(nextProps.pokemon)
});
```

## Infinite scroll
Outra técnica que podemos utilizar também é o “infinite scroll”.

Consiste basicamente em limitar a quantidade de itens exibidos em tela, e carregar mais elementos apenas quando necessário.

Ou seja, o usuário chega perto do final da página, e os itens adicionais são carregados.

### Exemplo de implementação
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

## Bonus
Falamos brevemente sobre memorização aqui. Mas existem outros tópicos que podem ser interessantes.

![](https://github.com/gabriel-Oak/poc-webworkers-filters/blob/main/images/Screenshot%20from%202022-11-29%2019-19-31.png?raw=true)

## Experimente também
* React.lazy e code splitting
* WebWorkers
* Bibliotecas gerenciadoras de data flow (Redux, MobX, BLoC)

# Obrigado!
Alguma duvida?
Você pode me encontrar em:

[Github](https://github.com/gabriel-Oak/) [LinkedIn](https://www.linkedin.com/in/gabriel-carvalho-costa) [Instagram](https://www.instagram.com/gabriel_oakcoast/)

## Creditos
Agradecimentos especiais a Mariana, por me aturar falando de código por horas e ser minha revisora

[Apresentação Powerpoint](https://docs.google.com/presentation/d/1klB8fYZAVymbm-VNF3Dzl31KzjSuOUer5phUwe7gE9E/edit?usp=sharing)

[Link para o projeto](https://github.com/gabriel-Oak/poc-webworkers-filters/)