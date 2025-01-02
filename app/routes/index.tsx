import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";
import { EventCardSkeleton } from "~/components/event-card-skeleton";
import { EventsList } from "~/components/events-list";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/")({
  component: Home,
  validateSearch: (searchParams: Record<string, unknown>) => {
    const filters = searchParams.filters;
    return Array.isArray(filters) &&
      filters.every((filter) => typeof filter === "string")
      ? { filters }
      : {};
  },
});

const skeletons = Array.from({ length: 2 });

function Home() {
  const navigate = useNavigate();
  const { filters = [] } = Route.useSearch();

  const toggleFilter = (filter: string) => {
    const newFilters = filters.includes(filter)
      ? filters.filter((f) => f !== filter)
      : [...filters, filter];

    const search = newFilters.length ? { filters: newFilters } : {};

    navigate({
      to: Route.fullPath,
      search,
    });
  };

  return (
    <main className="flex flex-col items-center">
      <h1 className="text-2xl mt-10 mb-6">Events</h1>
      <div className="flex flex-col gap-4 w-[500px] max-w-[90%]">
        <div className="flex gap-1 items-center">
          Filters:
          {["Foo", "Bar"].map((filter) => (
            <Button
              key={filter}
              size={"sm"}
              onClick={() => toggleFilter(filter)}
              variant={filters.includes(filter) ? "default" : "outline"}
            >
              {filter}
            </Button>
          ))}
        </div>
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
