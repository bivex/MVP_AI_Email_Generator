export enum EmailTone {
  FORMAL = "formal",
  FRIENDLY = "friendly",
  PERSUASIVE = "persuasive",
  CASUAL = "casual",
}

export const TONE_LABELS: Record<EmailTone, string> = {
  [EmailTone.FORMAL]: "Formal",
  [EmailTone.FRIENDLY]: "Friendly",
  [EmailTone.PERSUASIVE]: "Persuasive",
  [EmailTone.CASUAL]: "Casual",
}
