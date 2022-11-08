export interface GenericItem {
  name: string;
  url: string;
}

export interface Pokemon {
  name: string;
  base_experience: number;
  abilities: GenericItem[];
  forms: GenericItem[];
  moves: GenericItem[];
  sprites: {
    back_default: string;
    back_female: string;
    back_shiny: string;
    back_shiny_female: string;
    front_default: string;
    front_female: string;
    front_shiny: string;
    front_shiny_female: string;
  };
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: GenericItem;
  }>;
  types: Array<{
    slot: number;
    type: GenericItem;
  }>;
  weight: number;
}