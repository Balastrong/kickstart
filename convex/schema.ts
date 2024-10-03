import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { getEvent } from "./events";
import { getComments } from "./comments";

export default defineSchema({
  events: defineTable({
    name: v.string(),
    participants: v.array(v.id("users")),
    date: v.string(),
  }),
  users: defineTable({
    name: v.string(),
    pictureUrl: v.optional(v.string()),
    externalId: v.string(), // Clerk user ID
  }).index("byExternalId", ["externalId"]),
  comments: defineTable({
    event: v.id("events"),
    user: v.id("users"),
    text: v.string(),
  }).index("by_event", ["event"]),
});

export type EventWithParticipants = Awaited<ReturnType<typeof getEvent>>;

export type CommentWithUser = Awaited<ReturnType<typeof getComments>>[number];
