import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

export const getEvents = query({
  handler: async (ctx) => {
    return await ctx.db.query("events").collect();
  },
});

export const getEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    return await ctx.db.get(eventId);
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

    await ctx.db.patch(eventId, {
      participants: [...event?.participants, user._id],
    });
  },
});
