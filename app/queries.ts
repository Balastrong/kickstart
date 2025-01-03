import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export const eventQueries = {
  list: ({ filters }: { filters: string[] }) =>
    convexQuery(api.events.getEvents, { filters }),
  get: (eventId: Id<"events">) => convexQuery(api.events.getEvent, { eventId }),
};

export function useRsvpMutation() {
  const mutationFn = useConvexMutation(api.events.rsvp);

  return useMutation({ mutationFn });
}

export const commentsQueries = {
  list: (eventId: Id<"events">) =>
    convexQuery(api.comments.getComments, { eventId }),
};

export function usePostCommentMutation() {
  const mutationFn = useConvexMutation(api.comments.postComment);

  return useMutation({ mutationFn });
}

export function useDeleteCommentMutation() {
  const mutationFn = useConvexMutation(api.comments.deleteComment);

  return useMutation({ mutationFn });
}

export function useLikeCommentMutation() {
  const mutationFn = useConvexMutation(api.comments.likeComment);

  return useMutation({ mutationFn });
}
