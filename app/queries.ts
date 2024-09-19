import {
  convexAction,
  convexQuery,
  useConvexMutation,
} from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { v } from "convex/values";

export const eventQueries = {
  list: () => convexQuery(api.events.getEvents, {}),
};

export function useRsvpMutation() {
  const mutationFn = useConvexMutation(api.events.rsvp);

  return useMutation({ mutationFn });
}
