import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import ThemeProvider from './theme';

import Header from './components/Header';

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Interview Task Github",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reset-css@5.0.1/reset.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" />
        <style>
          {`
            * {
              box-sizing: border-box;
            }

            html {
              font-family: Arial, Helvetica, sans-serif;
            }
          `}
        </style>
        {typeof document === "undefined" ? "__STYLES__" : null /** Place to inject styled components */}
      </head>
      <body>
        <ThemeProvider>
          <Header />
          <Outlet />
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
