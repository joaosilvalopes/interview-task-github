import { useState, FormEvent, useEffect, useRef } from 'react';
import throttle from 'lodash.throttle';

import { SearchContainer, Title, SearchForm, SearchInput, SearchButton, SearchResultList, SearchResultListItem, SearchResultLink } from './Search.styles';

import searchUsers from '~/sdk/searchUsers';

type SearchFormOnSubmitEvent = FormEvent<HTMLFormElement> & {
  target: HTMLFormElement & {
    username: HTMLInputElement
  }
}

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
      const searchResult = await searchUsers(searchQuery, pageRef.current);

      pageRef.current++;
      
      setResultCount(searchResult.totalCount);
      setUsernames(reset ? searchResult.usernames : (prevUsernames) => prevUsernames.concat(searchResult.usernames));
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
    fetchNextPageRef.current(true);
  }, [searchQuery]);

  const handleSubmit = async (event: SearchFormOnSubmitEvent) => {
    event.preventDefault();

    setSearchQuery(event.target.username.value);
  };

  return (
    <SearchContainer>
      <Title>Github User Search</Title>
      <SearchForm onSubmit={handleSubmit} data-testid="search-form">
        <SearchInput placeholder="username" type="text" id="username" name="username" data-testid="search-input" />
        <SearchButton type="submit" data-testid="search-button">Search</SearchButton>
      </SearchForm>
      {!!resultCount && <p data-testid="result-count">Found {resultCount} results for {searchQuery}</p>}
      {usernames.length > 0 && (
        <SearchResultList>
          {usernames.map((username) => (
            <SearchResultListItem key={username}>
              <SearchResultLink onClick={() => setLoadingUser(username)} to={`/user/${username}`} data-testid="search-result-link">{loadingUser === username ? 'Loading' : username}</SearchResultLink>
            </SearchResultListItem>
          ))}
        </SearchResultList>
      )}
      {isLoadingNextPage && <p data-testid="loading-indicator">Loading...</p>}
    </SearchContainer>
  );
};

export default Search;
