# Interview task github

## Application architecture decisions

- Server side rendering using remix
- Styling using styled components
- Managing application state (dark/light theme) with context
- Unit testing with jest and react-testing-library
- Header component that is rendered on all pages with a button to change the dark/light theme and a button to go back to the index route
- Search page at route /search or / renders a search form that when submited redirects to /search/:searchQuery
- Search page at /search/:searchQuery (child route of /search) that renders on the server the first page of the matching github username results (100 results per page) and when the user scrols to the bottom of the page fetches the next page on the client side
- User page at /user/:username that renders on the server the user data and the first page of the user repositories (5 results per page) and when the user clicks the 'next page' button fetches the next page on the client side

### Folder structure

- components: generic components to be reused across the application
- hooks: generic hooks to be reused across the application (usePagination for pagination logic and useTheme for consuming the Theme context)
- routes: Application pages per route (
  /search: Search.tsx, 
  /search/:searchQuery: Search/$searchQuery.tsx, 
  /user/:username: User/$username.tsx
)
- sdk: Functions that fetch the github api and return the needed result
- test-utils: Test utility functions
- theme: dark/light theme variables and shared theme variables (medias, colors, headerHeight)

## How to run

### development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

### production

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```
