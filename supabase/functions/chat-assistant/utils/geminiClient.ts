import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai"

export const initGemini = () => {
  const apiKey = Deno.env.get('GEMINI_API_KEY')
  if (!apiKey) {
    throw new Error('Missing Gemini API key')
  }

  console.log('Initializing Gemini model...')
  const genAI = new GoogleGenerativeAI(apiKey)
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
}

export const generatePrompt = (context: any, message: string) => {
  return `You are a helpful AI assistant that has access to the user's learning data. 
Here is the relevant context about their learning journey:

Study Time Today: ${context.studyTime}
Break Time Today: ${context.breakTime}
Recent Journal Entries: ${JSON.stringify(context.recentJournalEntries, null, 2)}
Active Goals: ${JSON.stringify(context.activeGoals, null, 2)}
Completed Lessons: ${context.completedLessons}
Recent Content: ${JSON.stringify(context.recentContent, null, 2)}

User Question: ${message}

Please provide a helpful response based on this context. Consider:
1. Their study and break patterns
2. Recent learning activities and content
3. Progress towards their goals
4. Any relevant content from their library

Keep the response natural and conversational, and provide specific suggestions based on their learning journey.`
}

export const fetchWithRetry = async (model: any, prompt: string, retries = 3, baseDelay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt)
      return await result.response
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error)
      
      if (error.message?.includes('429') || error.message?.includes('RATE_LIMIT_EXCEEDED')) {
        if (i === retries - 1) throw error
        
        const delay = baseDelay * Math.pow(2, i)
        console.log(`Rate limit hit. Waiting ${delay}ms before retry...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      
      throw error
    }
  }
}