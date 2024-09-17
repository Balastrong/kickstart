import { query } from "./_generated/server";

export const getEvents = query({
  handler: async (ctx) => {
    return await ctx.db.query("events").collect();
  },
});
