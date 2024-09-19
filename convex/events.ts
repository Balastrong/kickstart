import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

export const getEvents = query({
  handler: async (ctx) => {
    const events = await ctx.db.query("events").collect();

    return Promise.all(
      events.map(async (event) => {
        const participants = await Promise.allSettled(
          event.participants.map(async (userId) => {
            return await ctx.db.get(userId);
          })
        ).then((results) =>
          results
            .map((result) =>
              result.status === "fulfilled" ? result.value : null
            )
            .filter(Boolean)
        );

        return {
          ...event,
          participants,
        };
      })
    );
  },
});

export const getEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    const event = await ctx.db.get(eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    const participants = await Promise.all(
      event.participants.map(async (userId) => {
        return await ctx.db.get(userId);
      })
    );

    return {
      ...event,
      participants,
    };
  },
});

export const rsvp = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const event = await ctx.db.get(eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    if (event.participants.includes(user._id)) {
      return;
    }

    await ctx.db.patch(eventId, {
      participants: [...event?.participants, user._id],
    });
  },
});
