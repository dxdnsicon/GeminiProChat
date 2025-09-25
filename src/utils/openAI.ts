import { GoogleGenerativeAI } from '@fuyun/generative-ai'

const apiKey = (import.meta.env.GEMINI_API_KEY)
const apiBaseUrl = (import.meta.env.API_BASE_URL)?.trim().replace(/\/$/, '')

let genAI = apiBaseUrl
  ? new GoogleGenerativeAI(apiKey, apiBaseUrl)
  : new GoogleGenerativeAI(apiKey)

export const startChatAndSendMessageStream = async(history: ChatMessage[], newMessage: string, appkey?: string) => {

  if (appkey) {
    genAI = new GoogleGenerativeAI('AIzaSyAjdMfOIQO_FcqoRyX_ZD-Qh23A1Vb8XQE')
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' })
  const chat = model.startChat({
    history: history.map(msg => ({
      role: msg.role,
      parts: msg.parts.map(part => part.text).join(''), // Join parts into a single string
    })),
    generationConfig: {
      maxOutputTokens: 8000,
    },
    safetySettings: [
      {category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE'},
      {category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE'},
      {category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE'},
      {category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE'}
      ],
  })
  // Use sendMessageStream for streaming responses
  const result = await chat.sendMessage(newMessage)
  console.log('result', JSON.stringify(result?.response?.text?.()))
  return result?.response?.text?.();

  // const result = await chat.sendMessageStream(newMessage)
  // const encodedStream = new ReadableStream({
  //   async start(controller) {
  //     const encoder = new TextEncoder()
  //     for await (const chunk of result.stream) {
  //       const text = await chunk.text()
  //       const encoded = encoder.encode(text)
  //       controller.enqueue(encoded)
  //     }
  //     controller.close()
  //   },
  // })

  // return encodedStream
}
