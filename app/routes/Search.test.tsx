import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Search from './Search';

const usernames = ['user1', 'user2', 'user3', 'user4', 'user5', 'use6'];
const pageSize = 2;
const totalCount = 6;

jest.mock('~/sdk/searchUsers', () => jest.fn((_,page) => {
  return new Promise((resolve) => setTimeout(() => resolve({ totalCount, usernames: usernames.slice((page - 1) * pageSize, page * pageSize) }), 100));
}));

const renderWithRouter = (element: React.ReactElement) => render(<Router>{element}</Router>)

describe('Search component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const expectResult = async (page: number) => {
    await waitFor(() => {
      expect(screen.getByTestId('result-count').textContent).toMatch(new RegExp(`found ${totalCount} results for testuser`, 'i'));
      expect(screen.getAllByTestId('search-result-link')).toHaveLength(pageSize * page);
    });
  }

  it('renders the search input and button', () => {
    const { getByTestId } = renderWithRouter(<Search />);

    expect(getByTestId('search-form')).toBeInTheDocument();
    expect(getByTestId('search-input')).toBeInTheDocument();
    expect(getByTestId('search-button')).toBeInTheDocument();
  });

  it('searches for users when the form is submitted', async () => {
    const { getByTestId } = renderWithRouter(<Search />);
    fireEvent.submit(getByTestId('search-form'), { target: { username: { value: 'testuser' } } });

    expect(getByTestId('loading-indicator')).toBeInTheDocument();

    await expectResult(1);
  });

  it('fetches the next page of users when scrolled to the bottom of the page', async () => {
    const { getByTestId } = renderWithRouter(<Search />);

    // Scroll to the bottom of the page
    window.innerHeight = 500;
    document.documentElement.scrollTop = 1000;

    Object.defineProperty(document.documentElement, 'offsetHeight', {
      writable: true,
      value: 1500,
    });

    fireEvent.submit(getByTestId('search-form'), { target: { username: { value: 'testuser' } } });

    for(let page = 1; page <= Math.ceil(totalCount / pageSize); page++) {
      expect(getByTestId('loading-indicator')).toBeInTheDocument();

      await expectResult(page);
  
      fireEvent.scroll(document);
    }
  });
});
