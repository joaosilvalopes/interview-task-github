import { Link } from '@remix-run/react';
import styled from 'styled-components';
import Spinner from '~/components/Spinner';

export const UserContainer = styled.main` 
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: calc(100vh - ${props => props.theme.headerHeight});
  color: ${props => props.theme.colors.main};
  background-color: ${props => props.theme.colors.mainBackground};
`;

export const UserHeader = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  background-color: ${props => props.theme.colors.userHeaderBackground};

  ${props => props.theme.media.gteSm} {
    flex-direction: row;
  }
`;

export const UserAvatar = styled.img`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);

  ${props => props.theme.media.gteSm} {
    margin-right: 1rem;
  }
`;

export const UserName = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.colors.username};
  margin: 1rem 0;

  ${props => props.theme.media.gteSm} {
    font-size: 2.5rem;
  }

  ${props => props.theme.media.gteMd} {
    font-size: 3rem;
  }
`;

export const UserRepositoriesCount = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.userRepositoriesCount};

  ${props => props.theme.media.gteSm} {
    margin-left: auto;
  }
`;

export const UserRepositoriesList = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 30rem;
`;

export const UserRepository = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 20%;
  width: 100%;
  padding: 0.75rem;
  border-bottom: 1px solid ${props => props.theme.colors.userRepositoryBorder};

  &:first-child {
    border-top: 1px solid ${props => props.theme.colors.userRepositoryBorder};
  }
`;

export const UserRepositoryName = styled.h2`
  font-size: 2rem;
  color: ${props => props.theme.colors.userRepositoryName};
`;

export const UserRepositoryDescription = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.userRepositoriesDescription};
  white-space: nowrap;
  overflow-x: clip;
  text-overflow: ellipsis;
`;

export const Pagination = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 1rem;
`;

export const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 0.5rem;
  color: ${props => props.theme.colors.userPaginationButton};
  background-color: ${props => props.theme.colors.userPaginationButtonBackground};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:not(:disabled):hover {
    background-color: ${props => props.theme.colors.userPaginationButtonBackgroundOnHover};
  }

  &:disabled {
    cursor: wait;
  }
`;

export const BackLink = styled(Link)`
  display: block;
  margin: auto 0 1rem 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1.2rem;
  text-decoration: none;
  transition: background-color 0.2s ease-in-out;
  color: ${props => props.theme.colors.backButton};
  background-color: ${props => props.theme.colors.backButtonBackground};

  &:hover {
    background-color: ${props => props.theme.colors.backButtonBackgroundOnHover};
  }
`;

export const PageCount = styled.span`
  display: flex;
  align-items: center;
  margin: 0 1rem;
  color: ${props => props.theme.colors.pageCount};
  font-size: 1.2rem;
`;

export const PageSpinner = styled(Spinner)`
  font-size: 10rem;
  border-width: 0.5rem;
  margin: auto;
  color: ${props => props.theme.colors.pageSpinner};
`;
