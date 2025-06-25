/**
 * API Testing Utility for Capture Booking Data API
 * 
 * This utility provides examples of how to test the API with different scenarios.
 * It's designed to help developers and LLMs understand how to interact with the API.
 * 
 * Usage:
 * 1. Ensure the API server is running on http://localhost:3000
 * 2. Have a test image file ready
 * 3. Run: node test-api.js
 */

import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

/**
 * Base configuration for API testing
 */
const API_CONFIG = {
  baseUrl: 'http://localhost:3000',
  endpoint: '/api/ask',
  timeout: 30000, // 30 seconds
};

/**
 * Example questions for testing different scenarios
 */
const TEST_QUESTIONS = {
  basic: [
    "What is the booking confirmation number?",
    "What is the hotel name?",
    "What are the check-in and check-out dates?"
  ],
  detailed: [
    "What is the booking confirmation number?",
    "What is the hotel name?",
    "What are the check-in and check-out dates?",
    "What is the guest name?",
    "What is the room type?",
    "What is the total price?",
    "What is the payment method?",
    "What is the booking status?"
  ],
  edgeCase: [
    "What is the room number?",
    "What is the cancellation policy?",
    "What is the hotel address?",
    "What is the number of guests?",
    "What is the booking date?"
  ]
};

/**
 * Test scenarios for different use cases
 */
const TEST_SCENARIOS = {
  validRequest: {
    name: 'Valid Request with Basic Questions',
    questions: TEST_QUESTIONS.basic,
    expectedStatus: 200,
    description: 'Tests a standard request with basic booking questions'
  },
  detailedRequest: {
    name: 'Detailed Request with Many Questions',
    questions: TEST_QUESTIONS.detailed,
    expectedStatus: 200,
    description: 'Tests a request with comprehensive questions about the booking'
  },
  missingFile: {
    name: 'Missing File Error',
    questions: TEST_QUESTIONS.basic,
    expectedStatus: 400,
    description: 'Tests error handling when no file is provided',
    skipFile: true
  },
  missingQuestions: {
    name: 'Missing Questions Error',
    questions: null,
    expectedStatus: 400,
    description: 'Tests error handling when no questions are provided',
    skipQuestions: true
  },
  invalidQuestionsFormat: {
    name: 'Invalid Questions Format',
    questions: 'not-a-json-array',
    expectedStatus: 400,
    description: 'Tests error handling with invalid JSON format'
  }
};

/**
 * Utility function to create a test image file for testing
 * This creates a simple text-based "image" for testing purposes
 */
function createTestImage() {
  const testImageContent = `
    Hotel Booking Confirmation
    =========================
    
    Confirmation Number: BK123456789
    Hotel: Grand Hotel & Spa
    Guest: John Smith
    Check-in: March 15, 2024
    Check-out: March 18, 2024
    Room Type: Deluxe King
    Total Price: $450.00
    Payment Method: Credit Card
    Status: Confirmed
  `;
  
  // Create a simple test file (in real usage, you'd use an actual image)
  fs.writeFileSync('test-booking.txt', testImageContent);
  return 'test-booking.txt';
}

/**
 * Makes a request to the API
 * @param {string} imagePath - Path to the image file
 * @param {Array|string} questions - Questions to ask (array or JSON string)
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} API response
 */
async function makeApiRequest(imagePath, questions, options = {}) {
  const formData = new FormData();
  
  // Add file if not skipped
  if (!options.skipFile && imagePath) {
    formData.append('file', fs.createReadStream(imagePath));
  }
  
  // Add questions if not skipped
  if (!options.skipQuestions) {
    const questionsString = Array.isArray(questions) 
      ? JSON.stringify(questions) 
      : questions;
    formData.append('questions', questionsString);
  }
  
  const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      timeout: API_CONFIG.timeout
    });
    
    const data = await response.json();
    
    return {
      status: response.status,
      ok: response.ok,
      data,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message,
      data: null
    };
  }
}

/**
 * Runs a single test scenario
 * @param {Object} scenario - Test scenario configuration
 * @param {string} imagePath - Path to test image
 * @returns {Promise<Object>} Test result
 */
async function runTestScenario(scenario, imagePath) {
  console.log(`\n🧪 Running: ${scenario.name}`);
  console.log(`📝 Description: ${scenario.description}`);
  
  const startTime = Date.now();
  const result = await makeApiRequest(imagePath, scenario.questions, scenario);
  const duration = Date.now() - startTime;
  
  const testResult = {
    scenario: scenario.name,
    expectedStatus: scenario.expectedStatus,
    actualStatus: result.status,
    success: result.status === scenario.expectedStatus,
    duration,
    response: result.data,
    error: result.error
  };
  
  // Log results
  console.log(`⏱️  Duration: ${duration}ms`);
  console.log(`📊 Status: ${result.status} (expected: ${scenario.expectedStatus})`);
  console.log(`✅ Success: ${testResult.success ? 'PASS' : 'FAIL'}`);
  
  if (result.data) {
    if (result.data.results) {
      console.log(`📋 Results: ${result.data.results.length} question-answer pairs`);
      result.data.results.forEach((qa, index) => {
        console.log(`  ${index + 1}. Q: ${qa.question}`);
        console.log(`     A: ${qa.answer || '(no answer)'}`);
      });
    } else if (result.data.error) {
      console.log(`❌ Error: ${result.data.error}`);
    }
  }
  
  if (result.error) {
    console.log(`💥 Request Error: ${result.error}`);
  }
  
  return testResult;
}

/**
 * Runs all test scenarios
 * @param {string} imagePath - Path to test image
 * @returns {Promise<Array>} Array of test results
 */
async function runAllTests(imagePath) {
  console.log('🚀 Starting API Tests');
  console.log(`📍 API URL: ${API_CONFIG.baseUrl}${API_CONFIG.endpoint}`);
  console.log(`🖼️  Test Image: ${imagePath}`);
  
  const results = [];
  
  for (const scenario of Object.values(TEST_SCENARIOS)) {
    try {
      const result = await runTestScenario(scenario, imagePath);
      results.push(result);
    } catch (error) {
      console.error(`❌ Test failed: ${scenario.name}`, error);
      results.push({
        scenario: scenario.name,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
}

/**
 * Generates a test report
 * @param {Array} results - Test results
 */
function generateReport(results) {
  console.log('\n📊 Test Report');
  console.log('==============');
  
  const totalTests = results.length;
  const passedTests = results.filter(r => r.success).length;
  const failedTests = totalTests - passedTests;
  
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (failedTests > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.success).forEach(result => {
      console.log(`  - ${result.scenario}: ${result.error || 'Unexpected status'}`);
    });
  }
  
  const avgDuration = results
    .filter(r => r.duration)
    .reduce((sum, r) => sum + r.duration, 0) / results.filter(r => r.duration).length;
  
  if (avgDuration) {
    console.log(`\n⏱️  Average Response Time: ${avgDuration.toFixed(0)}ms`);
  }
}

/**
 * Example usage function
 */
async function exampleUsage() {
  console.log('📖 Example API Usage');
  console.log('===================');
  
  // Example 1: Basic usage
  console.log('\n1️⃣ Basic Usage Example:');
  const basicExample = `
const formData = new FormData();
formData.append('file', imageFile);
formData.append('questions', JSON.stringify([
  "What is the booking confirmation number?",
  "What is the hotel name?"
]));

const response = await fetch('/api/ask', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result.results);
  `;
  console.log(basicExample);
  
  // Example 2: Error handling
  console.log('\n2️⃣ Error Handling Example:');
  const errorExample = `
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
  `;
  console.log(errorExample);
  
  // Example 3: Python usage
  console.log('\n3️⃣ Python Usage Example:');
  const pythonExample = `
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
  `;
  console.log(pythonExample);
}

/**
 * Main function to run the tests
 */
async function main() {
  try {
    // Check if running in test mode or example mode
    const args = process.argv.slice(2);
    const mode = args[0] || 'test';
    
    if (mode === 'example') {
      await exampleUsage();
      return;
    }
    
    // Create test image
    const testImagePath = createTestImage();
    
    // Run tests
    const results = await runAllTests(testImagePath);
    
    // Generate report
    generateReport(results);
    
    // Cleanup
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
    
    console.log('\n✨ Testing complete!');
    
  } catch (error) {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  }
}

// Export functions for use in other modules
export {
  makeApiRequest,
  runTestScenario,
  runAllTests,
  generateReport,
  exampleUsage,
  TEST_QUESTIONS,
  TEST_SCENARIOS
};

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
} 