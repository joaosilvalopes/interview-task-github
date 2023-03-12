import styled from 'styled-components';
import { Link } from '@remix-run/react';

export const SearchResultList = styled.ul`
  list-style: none;
  margin: 2rem 0;
  padding: 0;
  width: 100%;
  max-width: 40rem;
`;

export const SearchResultListItem = styled.li`
  margin-bottom: 1.5rem;
  text-align: center;
`;

export const SearchResultLink = styled(Link)`
  display: block;
  padding: 1rem;
  text-decoration: none;
  font-size: 1.6rem;
  font-weight: bold;
  border-radius: 0.25rem;
  background-color: #eee;
  color: #333;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ccc;
  }
`;
