import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { getEvent } from "./events";
import { getComments } from "./comments";

export default defineSchema({
  events: defineTable({
    name: v.string(),
    location: v.optional(v.string()),
    date: v.string(),
    website: v.optional(v.string()),
    participants: v.array(v.id("users")),
    cfpUrl: v.optional(v.string()),
    cfpEndDate: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  }),
  users: defineTable({
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    username: v.optional(v.string()),
    pictureUrl: v.optional(v.string()),
    externalId: v.string(), // Clerk user ID
  }).index("byExternalId", ["externalId"]),
  comments: defineTable({
    event: v.id("events"),
    user: v.id("users"),
    text: v.string(),
    likes: v.optional(v.array(v.id("users"))),
  }).index("by_event", ["event"]),
});

export type EventWithParticipants = Awaited<ReturnType<typeof getEvent>>;

export type CommentWithUser = Awaited<ReturnType<typeof getComments>>[number];
