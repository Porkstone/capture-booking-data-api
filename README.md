# Capture Booking Data API

A specialized API service that uses Google's Gemini AI to extract structured information from hotel checkout screenshots. This API analyzes images of booking confirmation pages and answers specific questions about the booking data.

## 🚀 Features

- **AI-Powered Analysis**: Uses Google's Gemini 2.0 Flash model for accurate image understanding
- **Structured Data Extraction**: Returns organized question-answer pairs from booking screenshots
- **Multiple Image Formats**: Supports PNG, JPEG, GIF, and WebP formats
- **Comprehensive Logging**: Structured logging with Winston and Seq integration
- **Error Handling**: Robust error handling with detailed error messages
- **CORS Support**: Cross-origin request support for web applications

## 📋 API Endpoints

### POST /api/ask

Analyzes a hotel checkout screenshot and returns answers to specified questions.

**Request Format:**
- Content-Type: `multipart/form-data`
- Parameters:
  - `file` (required): Image file of a hotel checkout page
  - `questions` (required): JSON string containing an array of questions

**Response Format:**
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

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd capture-booking-data-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file with:
   ```bash
   # Required
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
   
   # Optional (for logging)
   SEQ_SERVER_URL=http://localhost:5341
   SEQ_API_KEY=your_seq_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Access the API:**
   - API endpoint: `http://localhost:3000/api/ask`
   - OpenAPI documentation: `http://localhost:3000/openapi.yaml`

## 📚 Documentation

### 📖 [API Documentation](API_DOCUMENTATION.md)
Comprehensive guide covering:
- Detailed API usage examples
- Request/response formats
- Error handling
- Best practices
- Integration examples in multiple languages
- Troubleshooting guide

### 🔧 [OpenAPI Specification](openapi.yaml)
Machine-readable API specification including:
- Complete endpoint documentation
- Request/response schemas
- Example requests and responses
- Error codes and descriptions

### 🧪 [Testing Utility](test-api.js)
JavaScript utility for testing the API:
- Multiple test scenarios
- Error case testing
- Performance benchmarking
- Usage examples

### 📝 [TypeScript Types](src/types/api.ts)
Complete TypeScript interface definitions:
- Request/response types
- Error handling types
- Configuration interfaces
- Example constants

## 💡 Usage Examples

### JavaScript/TypeScript
```javascript
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
```

### Python
```python
import requests
import json

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
```

### cURL
```bash
curl -X POST http://localhost:3000/api/ask \
  -F "file=@booking_screenshot.png" \
  -F 'questions=["What is the booking confirmation number?", "What is the hotel name?"]'
```

## 🧪 Testing

Run the included test utility to verify API functionality:

```bash
# Run all tests
node test-api.js

# Show usage examples
node test-api.js example
```

## 🔍 Question Guidelines

### Good Questions
- "What is the booking confirmation number?"
- "What is the hotel name?"
- "What are the check-in and check-out dates?"
- "What is the guest name?"
- "What is the room type?"
- "What is the total price?"
- "What is the payment method?"
- "What is the booking status?"

### Avoid These Types
- Questions requiring external knowledge
- Subjective questions (e.g., "Is this a good deal?")
- Questions about future events
- Questions requiring calculations not shown in the image

## 🖼️ Image Requirements

### Supported Formats
- PNG
- JPEG/JPG
- GIF
- WebP

### Quality Guidelines
- Clear, readable text
- Good contrast
- Complete screenshot of the booking page
- Minimum resolution: 300x300 pixels
- Maximum file size: 10MB

## ⚠️ Error Handling

The API returns appropriate HTTP status codes:
- **200**: Successful analysis
- **400**: Bad request (missing parameters, invalid format)
- **500**: Internal server error (AI processing failures, network issues)

## 🔒 Security Considerations

- API key is stored server-side only
- CORS headers are set to allow cross-origin requests
- Input validation on all parameters
- Error messages don't expose sensitive information

## 📊 Performance

- Typical response time: 2-5 seconds
- Depends on image size and complexity
- Subject to Google's Gemini API rate limits
- Recommended: Maximum 10 requests per minute per client

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues and questions:
- Check the [API Documentation](API_DOCUMENTATION.md)
- Review the [Troubleshooting section](API_DOCUMENTATION.md#troubleshooting)
- Ensure all requirements are met (API key, image format, etc.)
- Test with a simple example first

## 🔄 Changelog

### v1.0.0
- Initial release
- Support for hotel booking screenshot analysis
- Integration with Google Gemini AI
- Structured logging with Winston and Seq
- Comprehensive error handling
- CORS support for cross-origin requests
- Complete API documentation and testing utilities
