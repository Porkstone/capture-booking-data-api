import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Capture Booking Data API</h1>
          <p className={styles.subtitle}>
            AI-powered extraction of structured information from hotel checkout screenshots
          </p>
        </div>

        {/* API Status */}
        <div className={styles.statusSection}>
          <div className={styles.statusCard}>
            <div className={styles.statusIndicator}></div>
            <span>API Status: Online</span>
          </div>
          <div className={styles.endpointInfo}>
            <code>POST /api/ask</code>
            <span>Analyze hotel booking screenshots with AI</span>
          </div>
        </div>

        {/* Quick Start */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>🚀 Quick Start</h2>
          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
              <span>JavaScript Example</span>
            </div>
            <pre className={styles.code}>
{`const formData = new FormData();
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
console.log(result.results);`}
            </pre>
          </div>
        </div>

        {/* Documentation Links */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>📚 Documentation</h2>
          <div className={styles.docsGrid}>
            <a href="/api/docs?file=API_DOCUMENTATION.md" className={styles.docCard}>
              <div className={styles.docIcon}>📖</div>
              <h3>API Documentation</h3>
              <p>Comprehensive guide with examples, best practices, and troubleshooting</p>
              <span className={styles.docLink}>View Documentation →</span>
            </a>
            
            <a href="/api/docs?file=openapi.yaml" className={styles.docCard}>
              <div className={styles.docIcon}>🔧</div>
              <h3>OpenAPI Specification</h3>
              <p>Machine-readable API specification with schemas and examples</p>
              <span className={styles.docLink}>View Specification →</span>
            </a>
            
            <a href="/api/docs?file=test-api.js" className={styles.docCard}>
              <div className={styles.docIcon}>🧪</div>
              <h3>Testing Utility</h3>
              <p>JavaScript utility for testing the API with various scenarios</p>
              <span className={styles.docLink}>View Tests →</span>
            </a>
            
            <a href="/api/docs?file=src/types/api.ts" className={styles.docCard}>
              <div className={styles.docIcon}>📝</div>
              <h3>TypeScript Types</h3>
              <p>Complete interface definitions for type safety</p>
              <span className={styles.docLink}>View Types →</span>
            </a>
          </div>
        </div>

        {/* Features */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>✨ Features</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🤖</div>
              <h4>AI-Powered Analysis</h4>
              <p>Uses Google&apos;s Gemini 2.0 Flash model for accurate image understanding</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📊</div>
              <h4>Structured Data</h4>
              <p>Returns organized question-answer pairs from booking screenshots</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🖼️</div>
              <h4>Multiple Formats</h4>
              <p>Supports PNG, JPEG, GIF, and WebP image formats</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📝</div>
              <h4>Comprehensive Logging</h4>
              <p>Structured logging with Winston and Seq integration</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🛡️</div>
              <h4>Error Handling</h4>
              <p>Robust error handling with detailed error messages</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🌐</div>
              <h4>CORS Support</h4>
              <p>Cross-origin request support for web applications</p>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>💡 Usage Examples</h2>
          <div className={styles.examplesGrid}>
            <div className={styles.exampleCard}>
              <h4>Python</h4>
              <pre className={styles.exampleCode}>
{`import requests
import json

def analyze_booking(image_path, questions):
    url = "http://localhost:3000/api/ask"
    with open(image_path, 'rb') as f:
        files = {'file': f}
        data = {'questions': json.dumps(questions)}
        response = requests.post(url, files=files, data=data)
        return response.json()['results']`}
              </pre>
            </div>
            
            <div className={styles.exampleCard}>
              <h4>cURL</h4>
              <pre className={styles.exampleCode}>
{`curl -X POST http://localhost:3000/api/ask \\
  -F "file=@booking_screenshot.png" \\
  -F 'questions=["What is the booking confirmation number?", "What is the hotel name?"]'`}
              </pre>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className={styles.ctaSection}>
          <h2>Ready to get started?</h2>
          <p>Set up your environment and start analyzing booking screenshots</p>
          <div className={styles.ctas}>
            <a
              className={styles.primary}
              href="/api/docs?file=API_DOCUMENTATION.md"
            >
              📖 Read Full Documentation
            </a>
            <a
              href="/api/docs?file=test-api.js"
              className={styles.secondary}
            >
              🧪 Run Tests
            </a>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>API Endpoints</h4>
            <a href="/api/ask">POST /api/ask</a>
          </div>
          <div className={styles.footerSection}>
            <h4>Documentation</h4>
            <a href="/api/docs?file=API_DOCUMENTATION.md">API Guide</a>
            <a href="/api/docs?file=openapi.yaml">OpenAPI Spec</a>
            <a href="/api/docs?file=test-api.js">Testing</a>
          </div>
          <div className={styles.footerSection}>
            <h4>Resources</h4>
            <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer">Next.js Docs</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2024 Capture Booking Data API. Built with Next.js and Google Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
}
