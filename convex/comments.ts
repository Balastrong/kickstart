import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

export const getComments = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_event", (q) => q.eq("event", eventId))
      .collect();

    return comments;
  },
});

export const postComment = mutation({
  args: { eventId: v.id("events"), text: v.string() },
  handler: async (ctx, { eventId, text }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const event = await ctx.db.get(eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    await ctx.db.insert("comments", {
      event: eventId,
      user: user._id,
      text,
    });
  },
});
