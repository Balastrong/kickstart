import {
  createRootRoute,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start";
import * as React from "react";
import { Header } from "~/components/header";
// @ts-expect-error
import css from "~/globals.css?url";

export const Route = createRootRoute({
  meta: () => [
    {
      charSet: "utf-8",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    {
      title: "Kickstart!",
    },
  ],
  links: () => [
    {
      rel: "stylesheet",
      href: css,
    },
  ],
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <Html>
      <Head>
        <Meta />
      </Head>
      <Body>
        <Header />
        <hr />
        {children}
        <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  );
}
