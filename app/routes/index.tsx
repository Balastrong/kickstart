// app/routes/index.tsx
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Event } from "../types";

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () =>
    await fetch("http://localhost:3000/api/events").then(
      (res) => res.json() as Promise<{ events: Event[] }>
    ),
});

function Home() {
  const router = useRouter();
  const { events } = Route.useLoaderData();

  return (
    <main>
      <h1>Events</h1>
      <ul>
        {events.map((event) => (
          <li key={event.name}>{event.name}</li>
        ))}
      </ul>
      <button
        onClick={() => {
          router.invalidate();
        }}
      >
        Reload
      </button>
    </main>
  );
}
