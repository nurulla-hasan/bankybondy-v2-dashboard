/** Mirrors ENUM_AUDIO_MODERATION_STATUS on the API; values double as filter values. */
export const audioModerationStatuses = [
  "processing",
  "ready",
  "rejected",
  "failed",
] as const;
