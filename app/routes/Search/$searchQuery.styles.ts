import styled from 'styled-components';
import { Link } from '@remix-run/react';

import Spinner from '~/components/Spinner';

export const SearchResultList = styled.ul`
  margin: 2rem 0 0;
  padding: 0;
  width: 100%;
  max-width: 40rem;
`;

export const SearchResultListItem = styled.li`
  margin-bottom: 1.5rem;
  text-align: center;
`;

export const SearchResultLink = styled(Link).withConfig<{ loading: boolean }>({ shouldForwardProp: (prop, isValidProp) => prop !== 'loading' && isValidProp(prop) })`
  display: flex;
  justify-content: center;
  padding: 1rem;
  text-decoration: none;
  font-size: 1.6rem;
  font-weight: bold;
  border-radius: 0.25rem;
  background-color: ${props => props.theme.colors.searchResultBackground};
  color: ${props => props.theme.colors.searchResult};
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    color: ${props => props.theme.colors.searchResultOnHover};
    background-color: ${props => props.theme.colors.searchResultBackgroundOnHover};
  }

  ${props => props.loading && `cursor: wait;`}
`;

export const InfiniteScrollSpinner = styled(Spinner)`
  margin-top: 1rem;
  font-size: 4rem;
`;
