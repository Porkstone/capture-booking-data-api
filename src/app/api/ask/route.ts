export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import winston from 'winston';
import { SeqTransport } from '@datalust/winston-seq';

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    new SeqTransport({
      serverUrl: process.env.SEQ_SERVER_URL || 'http://localhost:5341',
      apiKey: process.env.SEQ_API_KEY || '',
      onError: (e) => { console.error('SeqTransport error:', e); },
    }),
  ],
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const questionsRaw = formData.get('questions');
    if (!file || !questionsRaw) {
      logger.warn('Missing file or questions');
      return NextResponse.json({ error: 'Missing file or questions' }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    }
    const questions: string[] = JSON.parse(questionsRaw.toString());
    const arrayBuffer = await file.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = file.type || 'image/png';

    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    // Create a single prompt with all questions
    const prompt = `This is an array of questions about the image, the image is from a hotel checkout web page. Can you return an array of answers matching the index of the questions?

${JSON.stringify(questions, null, 2)}

Please respond with a JSON array of answers in the same order as the questions. If you cannot find the answer, return an empty string.`;

    const contents = [
      {
        role: "user",
        parts: [
          { text: prompt },
          { inlineData: { mimeType, data: base64Image } }
        ]
      }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents,
    });

    const responseText = response.text ?? '';
    logger.info('Gemini response', { response: responseText });

    // Try to parse the response as JSON array
    let answers: string[];
    try {
      // Extract JSON array from the response (in case there's additional text)
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        answers = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON array found, split by newlines or other delimiters
        answers = responseText.split('\n').filter(line => line.trim().length > 0);
      }
    } catch (parseError) {
      logger.warn('Failed to parse response as JSON, using raw response', { error: parseError });
      answers = [responseText];
    }

    // Ensure we have the same number of answers as questions
    while (answers.length < questions.length) {
      answers.push('');
    }
    answers = answers.slice(0, questions.length);

    const results = questions.map((question, index) => ({
      question,
      answer: answers[index] || ''
    }));

    return NextResponse.json({ results }, { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('API error', { error: message });
    return NextResponse.json({ error: message }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
} 