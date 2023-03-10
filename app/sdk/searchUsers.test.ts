import searchUsers from './searchUsers';

describe('searchUsers', () => {
  it('should return a search result object', async () => {
    const expectedResponse = {
      usernames: ['user1', 'user2', 'user3'],
      totalCount: 3,
    };

    const mockedResponse = {
      ok: true,
      json: async () => ({
        items: [
          { login: 'user1' },
          { login: 'user2' },
          { login: 'user3' },
        ],
        total_count: 3,
      }),
    };

    global.fetch = jest.fn(() => Promise.resolve(mockedResponse as Response));

    const result = await searchUsers('test', 1);

    expect(result).toEqual(expectedResponse);
  });

  it('should throw an error if the response is not ok', async () => {
    const mockedResponse = {
      ok: false,
    };

    global.fetch = jest.fn(() => Promise.resolve(mockedResponse as Response));

    await expect(searchUsers('test', 1)).rejects.toEqual(mockedResponse);
  });
});
