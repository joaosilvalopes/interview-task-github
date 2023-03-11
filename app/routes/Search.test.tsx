import { BrowserRouter as Router } from 'react-router-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Search from './Search';

const usernames = ['user1', 'user2', 'user3', 'user4', 'user5', 'user6'];
const pageSize = 2;

jest.mock('~/sdk/searchUsers', () => jest.fn((_,page) => {
  return new Promise((resolve) => setTimeout(() => resolve({ totalCount: usernames.length, usernames: usernames.slice((page - 1) * pageSize, page * pageSize) }), 100));
}));

const renderWithRouter = () => render(<Router><Search/></Router>)

describe('Search component', () => {
  const expectPageResult = async (page: number, getByTestId: (testId: string) => HTMLElement) => {
    await waitFor(() => {
      expect(getByTestId('result-count')).toHaveTextContent(`Found ${usernames.length} results for testuser`);

      usernames.slice(0, pageSize * page).forEach((username) => {
        expect(getByTestId(`search-result-link-${username}`)).toHaveTextContent(username);
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

    fireEvent.submit(getByTestId('search-form'), { target: { username: { value: 'testuser' } } });

    expect(getByTestId('loading-indicator')).toBeInTheDocument();

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

    fireEvent.submit(getByTestId('search-form'), { target: { username: { value: 'testuser' } } });

    for(let page = 1; page <= Math.ceil(usernames.length / pageSize); page++) {
      expect(getByTestId('loading-indicator')).toBeInTheDocument();

      await expectPageResult(page, getByTestId);
  
      fireEvent.scroll(document);
    }

    expect(asFragment()).toMatchSnapshot();
  });
});
