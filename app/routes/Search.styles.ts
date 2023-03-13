import styled from 'styled-components';

export const SearchContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - ${props => props.theme.headerHeight});
  padding: 2rem;
  color: ${props => props.theme.colors.main};
  background-color: ${props => props.theme.colors.mainBackground};

  ${props => props.theme.media.gteSm} {
    padding: 4rem;
  }
`;

export const Title = styled.h1`
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.2rem;

  ${props => props.theme.media.gteSm} {
    font-size: 2.5rem;
    margin-bottom: 3rem;
  }

  ${props => props.theme.media.gteLg} {
    font-size: 3.5rem;
  }
`;

export const SearchForm = styled.form`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 50rem;
  margin-bottom: 3rem;

  ${props => props.theme.media.gteSm} {
    flex-direction: row;
    align-items: stretch;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 0.1rem solid ${props => props.theme.colors.searchInputBorder};
  color: ${props => props.theme.colors.searchInput};
  background-color: ${props => props.theme.colors.searchInputBackground};
  font-size: 2rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.searchInputBorderOnFocus};
  }

  ${props => props.theme.media.gteSm} {
    border-radius: 0.5rem 0 0 0.5rem;
    border-right: none;
  }
`;

export const SearchButton = styled.button`
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  color: ${props => props.theme.colors.searchButton};
  background-color: ${props => props.theme.colors.searchButtonBackground};
  border: none;
  cursor: pointer;
  font-size: 2rem;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  transition: background-color 0.3s;
  margin-top: 1rem;

  ${props => props.theme.media.gteSm} {
    border-radius: 0 0.5rem 0.5rem 0;
    margin: 0;
  }

  &:not(:disabled):hover {
    background-color: ${props => props.theme.colors.searchButtonBackgroundOnHover};
  }

  &:disabled {
    cursor: wait;
  }
`;
