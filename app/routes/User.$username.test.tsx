import { fireEvent, render, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import User from './User.$username';

const pageSize = 10;

const user = {
    username: 'testuser',
    name: 'Test User',
    avatarUrl: 'https://example.com/avatar.png',
    repositoriesCount: pageSize * 3
};

const repositories = Array.from({ length: user.repositoriesCount }, (_, i) => ({
    id: i + 1,
    name: `Repository ${i + 1}`,
    description: `Description of Repository ${i + 1}`
}));

jest.mock('~/sdk/getRepositories', () => jest.fn((_, page: number) => repositories.slice((page - 1) * pageSize, page * pageSize)));

jest.mock('@remix-run/react', () => ({
    ...jest.requireActual('@remix-run/react'),
    useLoaderData: jest.fn(() => ({
        user,
        repositories: repositories.slice(0, pageSize),
    })),
}));

const renderWithRouter = () => render(<Router><User /></Router>)

describe('UserPage component', () => {
    it('renders user information and repositories', async () => {
        const { getByTestId, queryByTestId, asFragment } = renderWithRouter();

        expect(getByTestId('user-avatar')).toHaveAttribute("src", user.avatarUrl);
        expect(getByTestId('user-name')).toHaveTextContent(user.name);
        expect(getByTestId('user-repos-count')).toHaveTextContent(`Total number of repositories: ${user.repositoriesCount}`);

        for(const repo of repositories.slice(0, pageSize)) {
            expect(getByTestId(`repo-name-${repo.id}`)).toHaveTextContent(repo.name);
            expect(getByTestId(`repo-description-${repo.id}`)).toHaveTextContent(repo.description);
        }

        expect(queryByTestId(`loading-page-indicator`)).not.toBeInTheDocument();
        expect(getByTestId('page-count')).toHaveTextContent(`1/${Math.ceil(user.repositoriesCount / pageSize)}`);
        expect(queryByTestId(`previous-page-button`)).not.toBeInTheDocument();
        expect(getByTestId(`next-page-button`)).toBeInTheDocument();

        const nextPageButton = getByTestId('next-page-button');
    
        fireEvent.click(nextPageButton);

        expect(getByTestId(`loading-page-indicator`)).toBeInTheDocument();

        await waitFor(() => {
            for(const repo of repositories.slice(pageSize, pageSize * 2)) {
                expect(getByTestId(`repo-name-${repo.id}`)).toHaveTextContent(repo.name);
                expect(getByTestId(`repo-description-${repo.id}`)).toHaveTextContent(repo.description);
            }
        })

        expect(queryByTestId(`loading-page-indicator`)).not.toBeInTheDocument();
        expect(getByTestId('page-count')).toHaveTextContent(`2/${Math.ceil(user.repositoriesCount / pageSize)}`);
        expect(getByTestId(`previous-page-button`)).toBeInTheDocument();
        expect(getByTestId(`next-page-button`)).toBeInTheDocument();

        fireEvent.click(nextPageButton);

        expect(getByTestId(`loading-page-indicator`)).toBeInTheDocument();

        await waitFor(() => {
            for(const repo of repositories.slice(pageSize * 2, pageSize * 3)) {
                expect(getByTestId(`repo-name-${repo.id}`)).toHaveTextContent(repo.name);
                expect(getByTestId(`repo-description-${repo.id}`)).toHaveTextContent(repo.description);
            }
        })

        expect(queryByTestId(`loading-page-indicator`)).not.toBeInTheDocument();
        expect(getByTestId('page-count')).toHaveTextContent(`3/${Math.ceil(user.repositoriesCount / pageSize)}`);
        expect(getByTestId(`previous-page-button`)).toBeInTheDocument();
        expect(queryByTestId(`next-page-button`)).not.toBeInTheDocument();

        expect(asFragment()).toMatchSnapshot();
    });
});
