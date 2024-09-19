// app/routes/index.tsx
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { eventQueries } from "~/queries";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const router = useRouter();
  const eventsQuery = useSuspenseQuery(eventQueries.list());

  return (
    <main>
      <h1>Events</h1>
      <ul>
        {eventsQuery.data.map((event) => (
          <li key={event.name}>{event.name}</li>
        ))}
      </ul>
      <Button
        onClick={() => {
          router.invalidate();
        }}
      >
        Reload
      </Button>
    </main>
  );
}
