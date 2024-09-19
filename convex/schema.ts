import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { getEvent } from "./events";

export default defineSchema({
  events: defineTable({
    name: v.string(),
    participants: v.array(v.id("users")),
  }),
  users: defineTable({
    name: v.string(),
    pictureUrl: v.optional(v.string()),
    externalId: v.string(), // Clerk user ID
  }).index("byExternalId", ["externalId"]),
});

export type EventWithParticipants = Awaited<ReturnType<typeof getEvent>>;
