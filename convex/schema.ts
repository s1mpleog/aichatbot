import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    content: v.string(),
    userId: v.string(),
    userQuestion: v.string(),
  }),
});
