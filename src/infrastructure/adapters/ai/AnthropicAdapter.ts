import { IAIProvider } from "../../../application/interfaces/IAIProvider"
import { EmailContent } from "../../../domain/value-objects/EmailContent"
import { EmailLength } from "../../../domain/value-objects/EmailLength"
import { EmailTone } from "../../../domain/value-objects/EmailTone"
import { SubjectLine } from "../../../domain/value-objects/SubjectLine"

export class AnthropicAdapter implements IAIProvider {
  async generateEmail(params: {
    subject: SubjectLine
    tone: EmailTone
    length: EmailLength
  }): Promise<EmailContent> {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229",
        max_tokens: params.length === "short" ? 150 : params.length === "medium" ? 300 : 500,
        messages: [
          {
            role: "user",
            content: `Write a professional email with a ${params.tone} tone, ${params.length} length.\nSubject: ${params.subject.getValue()}`,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.content[0]?.text || ""

    return new EmailContent(content)
  }
}
