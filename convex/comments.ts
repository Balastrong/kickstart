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

    const users = await Promise.all(
      [...new Set(comments.map((comment) => comment.user))].map((userId) =>
        ctx.db.get(userId)
      )
    );

    return comments.map((comment) => ({
      ...comment,
      user: users.find((user) => user?._id === comment.user),
    }));
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

export const deleteComment = mutation({
  args: { commentId: v.id("comments") },
  handler: async (ctx, { commentId }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const comment = await ctx.db.get(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.user !== user._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(commentId);
  },
});

export const likeComment = mutation({
  args: { commentId: v.id("comments") },
  handler: async (ctx, { commentId }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const comment = await ctx.db.get(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (!comment.likes) {
      comment.likes = [];
    }

    if (comment.likes.includes(user._id)) {
      await ctx.db.patch(commentId, {
        likes: comment.likes.filter((id) => id !== user._id),
      });
    } else {
      await ctx.db.patch(commentId, {
        likes: [...comment.likes, user._id],
      });
    }
  },
});
