import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, Outlet, useParams } from '@remix-run/react';

import { SearchContainer, Title, SearchForm, SearchInput, SearchButton } from './Search.styles';

type SearchFormOnSubmitEvent = FormEvent<HTMLFormElement> & {
  target: HTMLFormElement & {
    username: HTMLInputElement
  }
}

const Search = () => {
  const navigate = useNavigate();
  const { searchQuery } = useParams();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: SearchFormOnSubmitEvent) => {
    event.preventDefault();

    const newSearchQuery = event.target.username.value;

    if(!newSearchQuery || searchQuery === newSearchQuery) return;

    setLoading(true);
    navigate(`/search/${newSearchQuery}`);
  };

  useEffect(() => {
    searchQuery && setLoading(false);
  }, [searchQuery]);

  return (
    <SearchContainer>
      <Title>Github User Search</Title>
      <SearchForm onSubmit={handleSubmit} data-testid="search-form">
        <SearchInput placeholder="username" type="text" id="username" name="username" defaultValue={searchQuery} data-testid="search-input" />
        <SearchButton type="submit" data-testid="search-button">{loading ? 'Loading' : 'Search'}</SearchButton>
      </SearchForm>
      <Outlet key={searchQuery} />
    </SearchContainer>
  );
};

export default Search;
