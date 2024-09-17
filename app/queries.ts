import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";

export const eventQueries = {
  list: () => convexQuery(api.events.getEvents, {}),
};
