import { useState, FormEvent, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Link } from '@remix-run/react';
import throttle from 'lodash.throttle';

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;

  @media only screen and (min-width: 768px) {
    padding: 4rem;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #333;
  margin-bottom: 1rem;
`;

const SearchForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 40rem;
`;

const SearchLabel = styled.label`
  font-size: 1.6rem;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  text-align: center;
  color: #333;

  @media only screen and (min-width: 768px) {
    margin-top: 0;
    margin-right: 1rem;
    text-align: right;
  }
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 0.1rem solid #ccc;
  width: 100%;
  font-size: 1.6rem;

  &:focus {
    outline: none;
    border-color: #0077b6;
    box-shadow: 0 0 0 0.2rem rgba(0, 119, 182, 0.25);
  }

  @media only screen and (min-width: 768px) {
    width: 50%;
  }
`;

const SearchButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  background-color: #0077b6;
  color: #fff;
  border: none;
  cursor: pointer;
  width: 100%;
  font-size: 1.6rem;
  transition: background-color 0.3s;

  @media only screen and (min-width: 768px) {
    margin-top: 0;
    width: auto;
  }

  &:hover {
    background-color: #023e8a;
  }
`;

const SearchResultList = styled.ul`
  list-style: none;
  margin: 2rem 0;
  padding: 0;
  width: 100%;
  max-width: 40rem;
`;

const SearchResultListItem = styled.li`
  margin-bottom: 1.5rem;
  text-align: center;
`;

const SearchResultLink = styled(Link)`
  padding: 1rem;
  border-radius: 0.25rem;
  background-color: #eee;
  color: #333;
  text-decoration: none;
  display: block;
  font-size: 1.6rem;
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ccc;
  }
`;

type SearchFormOnSubmitEvent = FormEvent<HTMLFormElement> & {
    target: HTMLFormElement & {
        username: HTMLInputElement
    }
}

type SearchUsersResponseData = { items: { login: string }[] };

const Search = () => {
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isLoadingRef = useRef<boolean>(false);
    const usernameRef = useRef<string>();
    const lastPageRef = useRef<number>(1);

    const fetchNextPage = useCallback(async () => {        
        if(isLoadingRef.current) return;

        setIsLoading(true);
        isLoadingRef.current = true;

        try {
            const res = await fetch(`https://api.github.com/search/users?q=${usernameRef.current}&per_page=100&page=${lastPageRef.current}&sort=followers`)

            if(!res.ok) throw res;

            const data: SearchUsersResponseData = await res.json();

            lastPageRef.current++;

            const newSearchResults = data.items.map((item) => item.login);

            setSearchResults((prevSearchResults) => [...prevSearchResults, ...newSearchResults]);
        } catch(e) {
            console.error(e);
        }

        setIsLoading(false);
        isLoadingRef.current = false;
    }, [setIsLoading, setSearchResults]);

    useEffect(() => {
        const handleScroll = throttle(() => {
            const isAtPageBottom = window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight;
            const isSearching = !!usernameRef.current;

            if (isAtPageBottom && isSearching) {
                fetchNextPage();
            }
        }, 100);

        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('scroll', handleScroll);
        };
    }, [fetchNextPage]);

    const handleSubmit = async (event: SearchFormOnSubmitEvent) => {
        event.preventDefault();

        usernameRef.current = event.target.username.value;

        fetchNextPage();
    };

    return (
        <SearchContainer>
            <Title>Github User Search</Title>
            <SearchForm onSubmit={handleSubmit}>
                <SearchLabel htmlFor="username">Username:</SearchLabel>
                <SearchInput type="text" id="username" name="username" />
                <SearchButton type="submit">Search</SearchButton>
            </SearchForm>
            {searchResults.length > 0 && (
                <>
                    <h2 style={{ fontSize: '2rem' }}>Search Results:</h2>
                    <SearchResultList>
                        {searchResults.map((result) => (
                            <SearchResultListItem key={result}>
                                <SearchResultLink to={`/user/${result}`}>{result}</SearchResultLink>
                            </SearchResultListItem>
                        ))}
                    </SearchResultList>
                </>
            )}
            {isLoading && <p>Loading...</p>}
        </SearchContainer>
    );
};

export default Search;
