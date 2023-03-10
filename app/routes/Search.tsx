import { useState, FormEvent, useEffect, useRef } from 'react';
import throttle from 'lodash.throttle';

import { SearchContainer, Title, SearchForm, SearchInput, SearchButton, SearchResultList, SearchResultListItem, SearchResultLink } from './Search.styles';

type SearchFormOnSubmitEvent = FormEvent<HTMLFormElement> & {
  target: HTMLFormElement & {
    username: HTMLInputElement
  }
}

type SearchUsersResponseData = { items: { login: string }[], total_count: number };

const Search = () => {
  const [usernames, setUsernames] = useState<string[]>([]);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState<string>();
  const [resultCount, setResultCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const pageRef = useRef<number>(1);
  const fetchNextPageRef = useRef<(reset: boolean) => void>(() => { });

  fetchNextPageRef.current = async (reset: boolean) => {
    if (!searchQuery || isLoadingNextPage) return;

    if (reset) pageRef.current = 1;

    setIsLoadingNextPage(true);

    try {
      const res = await fetch(`https://api.github.com/search/users?q=${searchQuery}&per_page=100&page=${pageRef.current}&sort=followers`)

      if (!res.ok) throw res;

      const data: SearchUsersResponseData = await res.json();

      pageRef.current++;

      const newSearchResults = data.items.map((item) => item.login);

      setResultCount(data.total_count);
      setUsernames(reset ? newSearchResults : (prevSearchResults) => prevSearchResults.concat(newSearchResults));
    } catch (e) {
      console.error(e);
    }

    setIsLoadingNextPage(false);
  };

  useEffect(() => {
    const handleScroll = throttle(() => {
      const isAtPageBottom = window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight;

      if (isAtPageBottom) {
        fetchNextPageRef.current(false);
      }
    }, 100);

    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    fetchNextPageRef.current(true)
  }, [searchQuery]);

  const handleSubmit = async (event: SearchFormOnSubmitEvent) => {
    event.preventDefault();

    setSearchQuery(event.target.username.value);
  };

  return (
    <SearchContainer>
      <Title>Github User Search</Title>
      <SearchForm onSubmit={handleSubmit}>
        <SearchInput placeholder="username" type="text" id="username" name="username" />
        <SearchButton type="submit">Search</SearchButton>
      </SearchForm>
      {!!resultCount && <p>Found {resultCount} results for {searchQuery}</p>}
      {usernames.length > 0 && (
        <SearchResultList>
          {usernames.map((username) => (
            <SearchResultListItem key={username}>
              <SearchResultLink onClick={() => setLoadingUser(username)} to={`/user/${username}`}>{loadingUser === username ? 'Loading' : username}</SearchResultLink>
            </SearchResultListItem>
          ))}
        </SearchResultList>
      )}
      {isLoadingNextPage && <p>Loading...</p>}
    </SearchContainer>
  );
};

export default Search;
