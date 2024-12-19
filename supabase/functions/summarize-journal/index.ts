import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "@google/generative-ai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content } = await req.json();
    
    // Initialize Gemini with the new model
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Create prompt for summarization
    const prompt = `Please summarize the following learning journal entry in Hebrew. Focus on the key points and main takeaways:

${content}

Please format the summary in bullet points and keep it concise.`;

    // Generate summary with the new model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    console.log('Successfully generated summary with Gemini 2.0 Flash');

    return new Response(
      JSON.stringify({ summary }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error in summarize-journal function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate summary' }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});