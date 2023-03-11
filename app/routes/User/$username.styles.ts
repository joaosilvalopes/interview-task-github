import { Link } from '@remix-run/react';
import styled from 'styled-components';

export const UserHeader = styled.header`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f2f2f2;

  @media screen and (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const UserAvatar = styled.img`
  width: 5rem;
  height: 5rem;
  margin-right: 1rem;
  border-radius: 50%;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);

  @media screen and (max-width: 480px) {
    margin-right: 0;
    margin-bottom: 1rem;
  }
`;

export const UserName = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

export const UserRepositoriesCount = styled.p`
font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #666;
`;

export const UserRepositoriesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem;
`;

export const UserRepository = styled.li`
  margin-bottom: 1rem;
`;

export const UserRepositoryName = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

export const UserRepositoryDescription = styled.p`
font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #666;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

export const PaginationButton = styled.button`
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 0.5rem;
  background-color: #eee;
  cursor: pointer;
  color: #333;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);

  &:not(:disabled):hover {
    background-color: #ddd;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const BackLink = styled(Link)`
  display: inline-block;
  margin-top: 2rem;
  color: blue;
  text-decoration: underline;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #555;
  }
`;

export const PageCount = styled.span`
  display: flex;
  align-items: center;
  margin-right: 1rem;
  color: #333;
  font-size: 1.2rem;
`;
