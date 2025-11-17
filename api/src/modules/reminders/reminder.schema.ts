import { Type, Static } from "@sinclair/typebox";

export const ReminderTypeEnum = Type.Union([
  Type.Literal("24h"),
  Type.Literal("1h"),
  Type.Literal("custom"),
]);

export const ReminderSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  card_id: Type.String({ format: "uuid" }),
  user_id: Type.String({ format: "uuid" }),
  reminder_time: Type.String({ format: "date-time" }),
  reminder_type: ReminderTypeEnum,
  sent: Type.Boolean(),
  created_at: Type.String({ format: "date-time" }),
});

export const CreateReminderSchema = Type.Object({
  card_id: Type.String({ format: "uuid" }),
  user_id: Type.String({ format: "uuid" }),
  reminder_time: Type.String({ format: "date-time" }),
  reminder_type: ReminderTypeEnum,
});

export const GetCardRemindersSchema = Type.Object({
  card_id: Type.String({ format: "uuid" }),
});

export const DeleteReminderSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
});

export type Reminder = Static<typeof ReminderSchema>;
export type CreateReminder = Static<typeof CreateReminderSchema>;
export type GetCardReminders = Static<typeof GetCardRemindersSchema>;
export type DeleteReminder = Static<typeof DeleteReminderSchema>;
