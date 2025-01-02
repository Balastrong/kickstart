import { SignInButton, UserButton } from "@clerk/clerk-react";
import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { Link } from "@tanstack/react-router";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { Skeleton } from "~/components/ui/skeleton";

export const Header = () => {
  return (
    <header className="px-4 py-2 flex gap-2 items-center justify-between max-w-screen-2xl mx-auto">
      <div className="text-xl leading-loose">
        <Link to="/">KickStart</Link>
      </div>
      <div className="flex gap-4 items-center">
        <a
          href="https://github.com/Balastrong/kickstart"
          target="_blank"
          rel="noreferrer"
        >
          <GitHubLogoIcon />
        </a>
        <a
          href="https://discord.gg/bqwyEa6We6"
          target="_blank"
          rel="noreferrer"
        >
          <DiscordLogoIcon />
        </a>
        <div>
          <Authenticated>
            <UserButton />
          </Authenticated>
          <Unauthenticated>
            <SignInButton mode="modal" />
          </Unauthenticated>
          <AuthLoading>
            <Skeleton className="size-7 rounded-full" />
          </AuthLoading>
        </div>
      </div>
    </header>
  );
};
