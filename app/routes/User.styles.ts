import { Link } from '@remix-run/react';
import styled from 'styled-components';

export const UserHeader = styled.header`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

export const UserAvatar = styled.img`
  width: 5rem;
  height: 5rem;
  margin-right: 1rem;
  border-radius: 50%;
`;

export const UserName = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

export const UserRepositoriesCount = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
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
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

export const UserRepositoryDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

export const PaginationButton = styled.button`
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 0.5rem;
  background-color: #eee;
  cursor: pointer;

  &:hover {
    background-color: #ddd;
  }
`;

export const BackLink = styled(Link)`
  display: inline-block;
  margin-top: 2rem;
  color: blue;
  text-decoration: underline;
  cursor: pointer;
`;

export const PageCount = styled.span`
    display: flex;
    align-items: center;
`;
