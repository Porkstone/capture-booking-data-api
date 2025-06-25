/**
 * TypeScript interfaces for the Capture Booking Data API
 * These interfaces define the structure of requests, responses, and data types
 * used throughout the API for better type safety and LLM understanding.
 */

/**
 * Represents a single question-answer pair from the analysis
 */
export interface QuestionAnswer {
  /** The question that was asked about the image */
  question: string;
  /** The answer extracted from the image, or empty string if not found */
  answer: string;
}

/**
 * Successful response from the /api/ask endpoint
 */
export interface AnalysisResponse {
  /** Array of question-answer pairs from the analysis */
  results: QuestionAnswer[];
}

/**
 * Error response from any API endpoint
 */
export interface ErrorResponse {
  /** Human-readable error message describing what went wrong */
  error: string;
}

/**
 * Union type for all possible API responses
 */
export type ApiResponse = AnalysisResponse | ErrorResponse;

/**
 * Request parameters for the /api/ask endpoint
 * Used for multipart form data
 */
export interface AskRequestParams {
  /** Image file to analyze (PNG, JPEG, GIF, WebP) */
  file: File;
  /** JSON string containing array of questions */
  questions: string;
}

/**
 * Parsed questions array (after JSON parsing)
 */
export type QuestionsArray = string[];

/**
 * Raw response from Google Gemini AI
 */
export interface GeminiResponse {
  /** The generated text content from Gemini */
  text?: string;
  /** Any additional response metadata */
  [key: string]: unknown;
}

/**
 * Content structure for Gemini AI requests
 */
export interface GeminiContent {
  /** Role of the content (user, assistant, etc.) */
  role: string;
  /** Parts of the content (text and/or image data) */
  parts: Array<{
    /** Text content */
    text?: string;
    /** Image data for multimodal requests */
    inlineData?: {
      /** MIME type of the image */
      mimeType: string;
      /** Base64 encoded image data */
      data: string;
    };
  }>;
}

/**
 * Configuration for Gemini AI model
 */
export interface GeminiModelConfig {
  /** Model name to use (e.g., 'gemini-2.0-flash-001') */
  model: string;
  /** Array of content objects for the request */
  contents: GeminiContent[];
}

/**
 * Environment variables required by the API
 */
export interface EnvironmentVariables {
  /** Google Generative AI API key (required) */
  GOOGLE_GENERATIVE_AI_API_KEY: string;
  /** Seq server URL for logging (optional) */
  SEQ_SERVER_URL?: string;
  /** Seq API key for logging (optional) */
  SEQ_API_KEY?: string;
}

/**
 * Logging levels supported by the Winston logger
 */
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

/**
 * Log entry structure for structured logging
 */
export interface LogEntry {
  /** Log level */
  level: LogLevel;
  /** Log message */
  message: string;
  /** Additional metadata */
  [key: string]: unknown;
}

/**
 * Supported image MIME types
 */
export type SupportedImageType = 
  | 'image/png'
  | 'image/jpeg'
  | 'image/jpg'
  | 'image/gif'
  | 'image/webp';

/**
 * Validation result for API requests
 */
export interface ValidationResult {
  /** Whether the request is valid */
  isValid: boolean;
  /** Error message if validation fails */
  error?: string;
}

/**
 * API endpoint configuration
 */
export interface ApiEndpointConfig {
  /** HTTP method */
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
  /** Endpoint path */
  path: string;
  /** Whether authentication is required */
  requiresAuth: boolean;
  /** Rate limiting configuration */
  rateLimit?: {
    /** Maximum requests per window */
    max: number;
    /** Time window in milliseconds */
    windowMs: number;
  };
}

/**
 * CORS configuration for API responses
 */
export interface CorsConfig {
  /** Allowed origin(s) */
  'Access-Control-Allow-Origin': string;
  /** Allowed methods */
  'Access-Control-Allow-Methods'?: string;
  /** Allowed headers */
  'Access-Control-Allow-Headers'?: string;
}

/**
 * Example questions for hotel booking analysis
 * These are commonly used questions that work well with the API
 */
export const EXAMPLE_QUESTIONS: string[] = [
  "What is the booking confirmation number?",
  "What is the hotel name?",
  "What are the check-in and check-out dates?",
  "What is the guest name?",
  "What is the room type?",
  "What is the total price?",
  "What is the payment method?",
  "What is the booking status?",
  "What is the cancellation policy?",
  "What is the hotel address?",
  "What is the room number?",
  "What is the number of guests?",
  "What is the booking date?",
  "What is the check-in time?",
  "What is the check-out time?"
];

/**
 * HTTP status codes used by the API
 */
export enum HttpStatus {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503
}

/**
 * Error types that can occur during API processing
 */
export enum ErrorType {
  MISSING_PARAMETERS = 'MISSING_PARAMETERS',
  INVALID_FORMAT = 'INVALID_FORMAT',
  GEMINI_API_ERROR = 'GEMINI_API_ERROR',
  IMAGE_PROCESSING_ERROR = 'IMAGE_PROCESSING_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}

/**
 * Detailed error information
 */
export interface DetailedError {
  /** Error type for programmatic handling */
  type: ErrorType;
  /** Human-readable error message */
  message: string;
  /** Additional error context */
  context?: Record<string, unknown>;
  /** Timestamp when error occurred */
  timestamp: string;
}

/**
 * API usage statistics
 */
export interface ApiStats {
  /** Total number of requests processed */
  totalRequests: number;
  /** Number of successful requests */
  successfulRequests: number;
  /** Number of failed requests */
  failedRequests: number;
  /** Average response time in milliseconds */
  averageResponseTime: number;
  /** Most common questions asked */
  topQuestions: Array<{
    question: string;
    count: number;
  }>;
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  /** Overall API health status */
  status: 'healthy' | 'unhealthy';
  /** Timestamp of the health check */
  timestamp: string;
  /** Version of the API */
  version: string;
  /** Dependencies health status */
  dependencies: {
    /** Gemini AI API status */
    gemini: 'healthy' | 'unhealthy';
    /** Database status (if applicable) */
    database?: 'healthy' | 'unhealthy';
  };
} 