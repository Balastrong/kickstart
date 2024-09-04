import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";

const events = [
  { name: "React SuperConf", participants: [] },
  { name: "TanStack Global Meet", participants: [] },
  { name: "Local Cozy Meetup2", participants: [] },
];

export const Route = createAPIFileRoute("/api/events")({
  GET: () => {
    return json({ events });
  },
});
