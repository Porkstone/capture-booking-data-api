# Capture Booking Data API Documentation

## Overview

The Capture Booking Data API is a specialized service that uses Google's Gemini AI to extract structured information from hotel checkout screenshots. It analyzes images of booking confirmation pages and answers specific questions about the booking data.

## API Endpoint

### POST /api/ask

Analyzes a hotel checkout screenshot and returns answers to specified questions.

#### Request Format

**Content-Type:** `multipart/form-data`

**Parameters:**
- `file` (required): Image file (PNG, JPEG, GIF, WebP) of a hotel checkout page
- `questions` (required): JSON string containing an array of questions

#### Response Format

**Success (200):**
```json
{
  "results": [
    {
      "question": "What is the booking confirmation number?",
      "answer": "BK123456789"
    },
    {
      "question": "What is the hotel name?",
      "answer": "Grand Hotel & Spa"
    }
  ]
}
```

**Error (400/500):**
```json
{
  "error": "Error message describing the issue"
}
```

## Usage Examples

### JavaScript/TypeScript

```javascript
// Example 1: Basic usage
const formData = new FormData();
formData.append('file', imageFile);
formData.append('questions', JSON.stringify([
  "What is the booking confirmation number?",
  "What is the hotel name?",
  "What are the check-in and check-out dates?"
]));

const response = await fetch('/api/ask', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result.results);

// Example 2: Error handling
try {
  const response = await fetch('/api/ask', {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  
  const result = await response.json();
  return result.results;
} catch (error) {
  console.error('API Error:', error.message);
}
```

### Python

```python
import requests
import json

# Example usage
def analyze_booking_screenshot(image_path, questions):
    url = "http://localhost:3000/api/ask"
    
    with open(image_path, 'rb') as image_file:
        files = {'file': image_file}
        data = {'questions': json.dumps(questions)}
        
        response = requests.post(url, files=files, data=data)
        
        if response.status_code == 200:
            return response.json()['results']
        else:
            raise Exception(response.json()['error'])

# Usage
questions = [
    "What is the booking confirmation number?",
    "What is the hotel name?",
    "What is the total price?"
]

results = analyze_booking_screenshot('booking_screenshot.png', questions)
for result in results:
    print(f"Q: {result['question']}")
    print(f"A: {result['answer']}")
    print()
```

### cURL

```bash
# Example cURL request
curl -X POST http://localhost:3000/api/ask \
  -F "file=@booking_screenshot.png" \
  -F 'questions=["What is the booking confirmation number?", "What is the hotel name?"]'
```

## Question Guidelines

### Good Questions
- "What is the booking confirmation number?"
- "What is the hotel name?"
- "What are the check-in and check-out dates?"
- "What is the guest name?"
- "What is the room type?"
- "What is the total price?"
- "What is the payment method?"
- "What is the booking status?"

### Avoid These Types of Questions
- Questions requiring external knowledge
- Subjective questions (e.g., "Is this a good deal?")
- Questions about future events
- Questions requiring calculations not shown in the image

## Image Requirements

### Supported Formats
- PNG
- JPEG/JPG
- GIF
- WebP

### Image Quality Guidelines
- Clear, readable text
- Good contrast
- Complete screenshot of the booking page
- Minimum resolution: 300x300 pixels
- Maximum file size: 10MB

### Best Practices
- Capture the entire booking confirmation page
- Ensure all relevant information is visible
- Avoid blurry or low-quality images
- Include headers and footers if they contain booking information

## Error Handling

### Common Error Codes

**400 Bad Request**
- Missing file or questions parameter
- Invalid JSON format for questions
- Unsupported file format

**500 Internal Server Error**
- Google Gemini API errors
- Image processing failures
- Network connectivity issues
- Invalid API key configuration

### Error Response Format
```json
{
  "error": "Human-readable error message"
}
```

## Environment Variables

The API requires the following environment variables:

```bash
# Required
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# Optional (for logging)
SEQ_SERVER_URL=http://localhost:5341
SEQ_API_KEY=your_seq_api_key_here
```

## Rate Limits and Quotas

- The API is subject to Google's Gemini API rate limits
- Recommended: Maximum 10 requests per minute per client
- Monitor your Google Cloud Console for quota usage

## Logging

The API uses Winston for structured logging with:
- Console output for development
- Seq transport for centralized logging (optional)
- Log levels: info, warn, error

## Security Considerations

- API key is stored server-side only
- CORS headers are set to allow cross-origin requests
- Input validation on all parameters
- Error messages don't expose sensitive information

## Performance Optimization

### Tips for Better Results
1. Use clear, specific questions
2. Ensure high-quality images
3. Include relevant context in questions
4. Batch related questions together

### Response Time
- Typical response time: 2-5 seconds
- Depends on image size and complexity
- Gemini API response time varies

## Integration Examples

### React Component

```jsx
import React, { useState } from 'react';

function BookingAnalyzer() {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([
    "What is the booking confirmation number?",
    "What is the hotel name?"
  ]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeImage = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('questions', JSON.stringify(questions));

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={analyzeImage} disabled={!file || loading}>
        {loading ? 'Analyzing...' : 'Analyze Image'}
      </button>
      
      {results && (
        <div>
          <h3>Results:</h3>
          {results.map((result, index) => (
            <div key={index}>
              <strong>Q: {result.question}</strong>
              <p>A: {result.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Node.js Server Integration

```javascript
const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');

const app = express();
const upload = multer();

app.post('/analyze-booking', upload.single('image'), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    formData.append('questions', JSON.stringify(req.body.questions));

    const response = await fetch('http://localhost:3000/api/ask', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Troubleshooting

### Common Issues

**"Missing file or questions" error**
- Ensure both file and questions parameters are provided
- Check that questions is a valid JSON string

**"Invalid JSON format" error**
- Verify questions parameter is properly JSON stringified
- Check for special characters in questions

**"Failed to generate content" error**
- Verify Google API key is valid and has sufficient quota
- Check network connectivity
- Ensure image format is supported

**Empty answers**
- Image quality may be too low
- Question may be too specific or unclear
- Information may not be visible in the image

### Debug Mode

Enable debug logging by setting the log level:

```javascript
// In the API route
const logger = winston.createLogger({
  level: 'debug', // Change from 'info' to 'debug'
  // ... rest of config
});
```

## API Versioning

Current version: 1.0.0

The API follows semantic versioning. Breaking changes will be introduced in major versions with appropriate migration guides.

## Support

For issues and questions:
- Check the troubleshooting section above
- Review the error messages for specific guidance
- Ensure all requirements are met (API key, image format, etc.)
- Test with a simple example first

## Changelog

### v1.0.0
- Initial release
- Support for hotel booking screenshot analysis
- Integration with Google Gemini AI
- Structured logging with Winston and Seq
- Comprehensive error handling
- CORS support for cross-origin requests 