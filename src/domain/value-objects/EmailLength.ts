export enum EmailLength {
  SHORT = "short",
  MEDIUM = "medium",
  LONG = "long",
}

export const LENGTH_LABELS: Record<EmailLength, string> = {
  [EmailLength.SHORT]: "Short (50-100 words)",
  [EmailLength.MEDIUM]: "Medium (150-250 words)",
  [EmailLength.LONG]: "Long (300+ words)",
}
