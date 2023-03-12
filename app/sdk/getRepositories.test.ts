import { PAGE_SIZE } from '~/routes/User/$username';

import getRepositories from './getRepositories';

describe('getRepositories function', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return an array of repositories', async () => {
    const mockRepos = [{ id: 1, name: 'repo1', description: 'description1' }, { id: 2, name: 'repo2', description: 'description2' }];

    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockRepos),
    } as Response));

    const repos = await getRepositories('testuser', 1, PAGE_SIZE);

    expect(repos).toEqual(mockRepos);
  });

  it('should throw an error if the response is not ok', async () => {
    const mockResponse = { ok: false };
    global.fetch = jest.fn(() => Promise.resolve(mockResponse as Response));

    await expect(getRepositories('testuser', 1, PAGE_SIZE)).rejects.toEqual(mockResponse);
  });
});
