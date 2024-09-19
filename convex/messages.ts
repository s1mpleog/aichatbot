import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createTask = mutation({
  args: {
    userId: v.string(),
    content: v.string(),
    userQuestion: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", { content: args.content, userId: args.userId, userQuestion: args.userQuestion });
  },
});

export const get = query({
  args: { userId: v.string() },

  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    return messages;
  },
});
