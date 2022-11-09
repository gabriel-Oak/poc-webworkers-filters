import React, { FC } from 'react';
import { useFilter } from './FilterContext';

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