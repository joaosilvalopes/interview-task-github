import getUser from './getUser';

describe('getUser', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return a user object', async () => {
        global.fetch = jest.fn(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                name: 'John Doe',
                avatar_url: 'https://avatars.githubusercontent.com/u/12345?v=4',
                public_repos: 10
            })
        } as Response));

        const username: string = 'johndoe';
        const user = await getUser(username);

        expect(user).toEqual({
            username,
            name: 'John Doe',
            avatarUrl: 'https://avatars.githubusercontent.com/u/12345?v=4',
            repositoriesCount: 10
        });
    });

    it('should throw an error if the response is not ok', async () => {
        const mockedResponse = { ok: false };

        global.fetch = jest.fn(() => Promise.resolve(mockedResponse as Response));

        await expect(getUser('testuser')).rejects.toEqual(mockedResponse);
    });
});