import { useSuspenseQuery } from "@tanstack/react-query";
import { EventCard } from "./event-card";
import { eventQueries } from "~/queries";
import { getRouteApi } from "@tanstack/react-router";

export const EventsList = () => {
  const { filters = [] } = getRouteApi("/").useSearch();
  const eventsQuery = useSuspenseQuery(eventQueries.list({ filters }));

  return eventsQuery.data.map((event) => (
    <EventCard key={event._id} event={event} />
  ));
};
