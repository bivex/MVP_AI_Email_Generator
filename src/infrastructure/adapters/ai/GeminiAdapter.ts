import { IAIProvider } from "../../../application/interfaces/IAIProvider"
import { EmailContent } from "../../../domain/value-objects/EmailContent"
import { EmailLength } from "../../../domain/value-objects/EmailLength"
import { EmailTone } from "../../../domain/value-objects/EmailTone"
import { SubjectLine } from "../../../domain/value-objects/SubjectLine"

export class GeminiAdapter implements IAIProvider {
  async generateEmail(params: {
    subject: SubjectLine
    tone: EmailTone
    length: EmailLength
  }): Promise<EmailContent> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Write a professional email with a ${params.tone} tone, ${params.length} length.\nSubject: ${params.subject.getValue()}`,
                },
              ],
            },
          ],
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

    return new EmailContent(content)
  }
}
