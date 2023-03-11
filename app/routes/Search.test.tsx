import { Routes, Route, MemoryRouter as Router } from 'react-router-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';

import Search from './Search';
import SearchResults from './Search/$searchQuery';

const pageSize = 100;
const usernames = Array.from({ length: pageSize * 3 }, (_, i) => `user${i+1}`);
const usernamesFirstPage = usernames.slice(0, pageSize);

jest.mock('~/sdk/searchUsers', () => jest.fn((_,page) => {
  return new Promise((resolve) => setTimeout(() => resolve({ totalCount: usernames.length, usernames: usernames.slice((page - 1) * pageSize, page * pageSize) }), 100));
}));

jest.mock('@remix-run/react', () => ({
  ...jest.requireActual('@remix-run/react'),
  useLoaderData: jest.fn(() => ({
      totalCount: usernames.length,
      usernames: usernamesFirstPage,
  })),
}));

const renderWithRouter = () => render(
  <Router initialEntries={['/search']}>
    <Routes>
      <Route path="search" element={<Search/>}>
        <Route path=":searchQuery" element={<SearchResults />}></Route>
      </Route>
    </Routes>
  </Router>
);

describe('Search component', () => {
  const expectPageResult = async (page: number, getByTestId: (testId: string) => HTMLElement) => {
    await waitFor(() => {
      expect(getByTestId('result-count')).toHaveTextContent(`Found ${usernames.length} results for testQuery`);

      usernames.slice(0, pageSize * page).forEach((username) => {
        expect(getByTestId(`search-result-link-${username}`)).toHaveTextContent(username);
        expect(getByTestId(`search-result-link-${username}`)).toHaveAttribute('href', `/user/${username}`);
      });
    });
  }

  it('renders the search input and button', () => {
    const { getByTestId, asFragment } = renderWithRouter();

    expect(getByTestId('search-form')).toBeInTheDocument();
    expect(getByTestId('search-input')).toBeInTheDocument();
    expect(getByTestId('search-button')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('searches for users when the form is submitted', async () => {
    const { getByTestId, asFragment } = renderWithRouter();

    fireEvent.submit(getByTestId('search-form'), { target: { username: { value: 'testQuery' } } });

    await expectPageResult(1, getByTestId);

    expect(asFragment()).toMatchSnapshot();
  });

  it('fetches the next page of users when scrolled to the bottom of the page', async () => {
    const { getByTestId, asFragment } = renderWithRouter();

    // Scroll to the bottom of the page
    window.innerHeight = 500;
    document.documentElement.scrollTop = 1000;

    Object.defineProperty(document.documentElement, 'offsetHeight', {
      writable: true,
      value: 1500,
    });

    fireEvent.submit(getByTestId('search-form'), { target: { username: { value: 'testQuery' } } });

    for(let page = 1; page <= Math.ceil(usernames.length / pageSize); page++) {
      await expectPageResult(page, getByTestId);
  
      fireEvent.scroll(document);

      expect(getByTestId('loading-indicator')).toBeInTheDocument();
    }

    expect(asFragment()).toMatchSnapshot();
  });
});
