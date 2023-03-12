import styled from 'styled-components';

export const SearchContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  min-height: 100vh;

  @media only screen and (min-width: 768px) {
    padding: 4rem;
  }
`;

export const Title = styled.h1`
  margin-bottom: 3rem;
  font-size: 3rem;
  color: #333;
`;

export const SearchForm = styled.form`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  max-width: 40rem;
  margin-bottom: 2rem;
`;

export const SearchInput = styled.input`
  padding: 0.5rem;
  width: 100%;
  border-radius: 0.5rem 0.5rem 0 0;
  border: 0.1rem solid #ccc;
  font-size: 1.6rem;

  &:focus {
    outline: none;
    border-color: #0077b6;
    box-shadow: 0 0 0 0.2rem rgba(0, 119, 182, 0.25);
  }

  @media only screen and (min-width: 768px) {
    width: 50%;
    border-radius: 0.5rem 0 0 0.5rem;
  }
`;

export const SearchButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0 0 0.5rem 0.5rem;
  background-color: #0077b6;
  color: #fff;
  border: none;
  cursor: pointer;
  width: 100%;
  font-size: 1.6rem;
  transition: background-color 0.3s;

  @media only screen and (min-width: 768px) {
    width: auto;
    border-radius: 0 0.5rem 0.5rem 0;
  }

  &:hover {
    background-color: #023e8a;
  }
`;
