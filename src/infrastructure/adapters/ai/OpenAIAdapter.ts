import { IAIProvider } from "../../../application/interfaces/IAIProvider"
import { EmailContent } from "../../../domain/value-objects/EmailContent"
import { EmailLength } from "../../../domain/value-objects/EmailLength"
import { EmailTone } from "../../../domain/value-objects/EmailTone"
import { SubjectLine } from "../../../domain/value-objects/SubjectLine"

export class OpenAIAdapter implements IAIProvider {
  async generateEmail(params: {
    subject: SubjectLine
    tone: EmailTone
    length: EmailLength
  }): Promise<EmailContent> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a professional email writer. Write emails with a ${params.tone} tone, ${params.length} length.`,
          },
          {
            role: "user",
            content: `Write an email with subject: "${params.subject.getValue()}"`,
          },
        ],
        max_tokens: params.length === "short" ? 150 : params.length === "medium" ? 300 : 500,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ""

    return new EmailContent(content)
  }
}
