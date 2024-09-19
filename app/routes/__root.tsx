// app/routes/__root.tsx
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";
import {
  createRootRoute,
  Link,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start";
import * as React from "react";
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
      title: "TanStack Start Starter",
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
        <header className="p-2 flex gap-2 text-lg">
          <div>
            <Link
              to="/"
              activeProps={{
                className: "font-bold",
              }}
              activeOptions={{ exact: true }}
            >
              KickStart
            </Link>
          </div>
          <div className="ml-auto">
            <Authenticated>
              <UserButton />
            </Authenticated>
            <Unauthenticated>
              <SignInButton mode="modal" />
            </Unauthenticated>
            {/* <AuthLoading>•</AuthLoading> */}
          </div>
        </header>
        <hr />
        {children}
        <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  );
}
