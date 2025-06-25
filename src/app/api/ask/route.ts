export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import winston from 'winston';
import { SeqTransport } from '@datalust/winston-seq';

/**
 * Winston logger configuration for structured logging
 * Includes console output and Seq transport for centralized logging
 */
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

/**
 * Analyzes a hotel checkout screenshot using Google's Gemini AI
 * 
 * This endpoint accepts a multipart form data request containing:
 * - file: An image file (PNG, JPEG, GIF, WebP) of a hotel checkout page
 * - questions: A JSON string array of questions to ask about the image
 * 
 * The AI analyzes the image and returns structured answers to each question.
 * 
 * @param req - NextRequest object containing multipart form data
 * @returns NextResponse with analysis results or error message
 * 
 * @example
 * ```javascript
 * const formData = new FormData();
 * formData.append('file', imageFile);
 * formData.append('questions', JSON.stringify([
 *   "What is the booking confirmation number?",
 *   "What is the hotel name?",
 *   "What are the check-in and check-out dates?"
 * ]));
 * 
 * const response = await fetch('/api/ask', {
 *   method: 'POST',
 *   body: formData
 * });
 * 
 * const result = await response.json();
 * // result.results contains array of {question, answer} pairs
 * ```
 * 
 * @throws {400} When file or questions are missing
 * @throws {500} When AI processing fails or other internal errors occur
 */
export async function POST(req: NextRequest) {
  try {
    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const questionsRaw = formData.get('questions');
    
    // Validate required parameters
    if (!file || !questionsRaw) {
      logger.warn('Missing file or questions');
      return NextResponse.json(
        { error: 'Missing file or questions' }, 
        { 
          status: 400, 
          headers: { 'Access-Control-Allow-Origin': '*' } 
        }
      );
    }
    
    // Parse questions array from JSON string
    let questions: string[];
    try {
      questions = JSON.parse(questionsRaw.toString());
      if (!Array.isArray(questions)) {
        throw new Error('Questions must be an array');
      }
    } catch (parseError) {
      logger.warn('Invalid questions format', { error: parseError });
      return NextResponse.json(
        { error: 'Invalid JSON format for questions parameter' }, 
        { 
          status: 400, 
          headers: { 'Access-Control-Allow-Origin': '*' } 
        }
      );
    }
    
    // Convert image to base64 for AI processing
    const arrayBuffer = await file.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = file.type || 'image/png';

    // Initialize Google Gemini AI client
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    // Create comprehensive prompt for the AI
    const prompt = `This is an array of questions about the image, the image is from a hotel checkout web page. Can you return an array of answers matching the index of the questions?

${JSON.stringify(questions, null, 2)}

Please respond with a JSON array of answers in the same order as the questions. If you cannot find the answer, return an empty string.`;

    // Prepare content for Gemini AI
    const contents = [
      {
        role: "user",
        parts: [
          { text: prompt },
          { inlineData: { mimeType, data: base64Image } }
        ]
      }
    ];

    // Generate content using Gemini 2.0 Flash model
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents,
    });

    const responseText = response.text ?? '';
    logger.info('Gemini response', { response: responseText });

    // Parse AI response and extract answers
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

    // Format results as question-answer pairs
    const results = questions.map((question, index) => ({
      question,
      answer: answers[index] || ''
    }));
    logger.info('Processed results', { results });

    // Return successful response
    return NextResponse.json(
      { results }, 
      { 
        status: 200, 
        headers: { 'Access-Control-Allow-Origin': '*' } 
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('API error', { error: message });
    return NextResponse.json(
      { error: message }, 
      { 
        status: 500, 
        headers: { 'Access-Control-Allow-Origin': '*' } 
      }
    );
  }
} 