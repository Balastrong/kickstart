// app/routes/index.tsx
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { EventCard } from "~/components/event-card";
import { Button } from "~/components/ui/button";
import { eventQueries } from "~/queries";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const router = useRouter();
  const eventsQuery = useSuspenseQuery(eventQueries.list());

  return (
    <main className="flex flex-col items-center">
      <h1 className="text-2xl mt-10 mb-6">Events</h1>
      <div className="flex flex-col gap-4 min-w-96">
        {eventsQuery.data.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </main>
  );
}
