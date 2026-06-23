import { IAIProvider } from "../../../application/interfaces/IAIProvider"
import { EmailContent } from "../../../domain/value-objects/EmailContent"
import { EmailLength } from "../../../domain/value-objects/EmailLength"
import { EmailTone } from "../../../domain/value-objects/EmailTone"
import { SubjectLine } from "../../../domain/value-objects/SubjectLine"

const MOCK_TEMPLATES: Record<EmailTone, Record<EmailLength, string>> = {
  [EmailTone.FORMAL]: {
    [EmailLength.SHORT]: "Dear Sir/Madam,\n\nThank you for your inquiry. We will respond promptly.\n\nBest regards",
    [EmailLength.MEDIUM]: "Dear Sir/Madam,\n\nThank you for reaching out to us. We have reviewed your request and are pleased to provide the following information.\n\nPlease do not hesitate to contact us should you require any further assistance.\n\nBest regards",
    [EmailLength.LONG]: "Dear Sir/Madam,\n\nThank you for your correspondence. We appreciate the opportunity to assist you.\n\nAfter careful review of your inquiry, we would like to provide the following detailed response.\n\nShould you have any further questions or require additional information, please do not hesitate to reach out.\n\nBest regards",
  },
  [EmailTone.FRIENDLY]: {
    [EmailLength.SHORT]: "Hey there!\n\nThanks for reaching out! Let's chat soon.\n\nCheers",
    [EmailLength.MEDIUM]: "Hey there!\n\nThanks so much for getting in touch! We're excited to help you out.\n\nLet us know if you have any other questions — we're here to help!\n\nCheers",
    [EmailLength.LONG]: "Hey there!\n\nThanks so much for reaching out! We're thrilled to connect with you.\n\nWe've put together some great ideas and information that we think you'll love. Take a look and let us know what you think!\n\nFeel free to reach out anytime — we're always happy to chat.\n\nCheers",
  },
  [EmailTone.PERSUASIVE]: {
    [EmailLength.SHORT]: "Don't miss out!\n\nThis is your chance to transform your workflow. Act now!\n\nBest",
    [EmailLength.MEDIUM]: "Don't miss this opportunity!\n\nWe've helped thousands achieve remarkable results. Here's how you can too.\n\nTake the first step today — your future self will thank you.\n\nBest",
    [EmailLength.LONG]: "This is the moment you've been waiting for.\n\nImagine a world where your biggest challenges are solved effortlessly. That world is within reach.\n\nWe've developed a proven system that delivers real, measurable results. And now, it's available to you.\n\nDon't let this pass you by. The only thing standing between you and success is taking action.\n\nBest",
  },
  [EmailTone.CASUAL]: {
    [EmailLength.SHORT]: "Hey!\n\nJust wanted to drop a quick note. Talk soon!\n\nLater",
    [EmailLength.MEDIUM]: "Hey!\n\nJust wanted to reach out and say hi! Hope everything's going well on your end.\n\nLet's catch up soon — it's been too long!\n\nLater",
    [EmailLength.LONG]: "Hey!\n\nSo I was thinking about you the other day and figured I should shoot you a message.\n\nHope life's treating you well! I've got some fun updates to share when we next chat.\n\nAnyway, let's plan something soon — coffee, drinks, whatever works!\n\nLater",
  },
}

export class MockAIAdapter implements IAIProvider {
  async generateEmail(params: {
    subject: SubjectLine
    tone: EmailTone
    length: EmailLength
  }): Promise<EmailContent> {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const template = MOCK_TEMPLATES[params.tone]?.[params.length]
    if (!template) {
      throw new Error("Invalid tone or length combination")
    }

    const content = template.replace(
      "{subject}",
      params.subject.getValue(),
    )

    return new EmailContent(content)
  }
}
