import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import { DataModel, Doc } from "./_generated/dataModel";
import { GenericQueryCtx, SchemaDefinition } from "convex/server";

function isDefined<T>(value: T | undefined | null): value is T {
  return !!value;
}

const getEventParticipants = async (
  ctx: GenericQueryCtx<DataModel>,
  event: Doc<"events">
) => {
  return await Promise.allSettled(
    event.participants.map(async (userId) => {
      return await ctx.db.get(userId);
    })
  ).then((results) =>
    results
      .map((result) =>
        result.status === "fulfilled" ? result.value : undefined
      )
      .filter(isDefined)
  );
};

export const getEvents = query({
  handler: async (ctx) => {
    const events = await ctx.db.query("events").collect();

    return Promise.all(
      events.map(async (event) => {
        const participants = await getEventParticipants(ctx, event);

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

    const participants = await getEventParticipants(ctx, event);

    return {
      ...event,
      participants,
    };
  },
});

export const rsvp = mutation({
  args: { eventId: v.id("events"), going: v.optional(v.boolean()) },
  handler: async (ctx, { eventId, going }) => {
    const user = await getCurrentUserOrThrow(ctx);
    const event = await ctx.db.get(eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    const isParticipant = event.participants.includes(user._id);

    if (going === undefined) {
      going = !isParticipant;
    }

    if (going && !isParticipant) {
      await ctx.db.patch(eventId, {
        participants: [...event.participants, user._id],
      });
    } else if (!going && isParticipant) {
      await ctx.db.patch(eventId, {
        participants: event.participants.filter((id) => id !== user._id),
      });
    } else {
      console.log("No changes needed");
    }
  },
});
