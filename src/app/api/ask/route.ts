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

    const results: { question: string; answer: string }[] = [];
    for (const question of questions) {
      const contents = [
        {
          role: "user",
          parts: [
            { text: question },
            { inlineData: { mimeType, data: base64Image } }
          ]
        }
      ];
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents,
      });
      results.push({ question, answer: response.text ?? '' });
      logger.info('Gemini answer', { question, answer: response.text ?? '' });
    }
    return NextResponse.json({ results }, { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('API error', { error: message });
    return NextResponse.json({ error: message }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
} 