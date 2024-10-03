import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { EventCardSkeleton } from "~/components/event-card-skeleton";
import { EventsList } from "~/components/events-list";

export const Route = createFileRoute("/")({
  component: Home,
});

const skeletons = Array.from({ length: 2 });

function Home() {
  return (
    <main className="flex flex-col items-center">
      <h1 className="text-2xl mt-10 mb-6">Events</h1>
      <div className="flex flex-col gap-4 w-[500px] max-w-[90%]">
        <React.Suspense
          fallback={skeletons.map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        >
          <EventsList />
        </React.Suspense>
      </div>
    </main>
  );
}
