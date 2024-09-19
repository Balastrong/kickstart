import { useSuspenseQuery } from "@tanstack/react-query";
import { EventCard } from "./event-card";
import { eventQueries } from "~/queries";

export const EventsList = () => {
  const eventsQuery = useSuspenseQuery(eventQueries.list());

  return eventsQuery.data.map((event) => (
    <EventCard key={event._id} event={event} />
  ));
};
