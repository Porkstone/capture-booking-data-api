'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './docs.module.css';

export default function DocsPage() {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeDoc, setActiveDoc] = useState('API_DOCUMENTATION.md');

  const documents = [
    { id: 'API_DOCUMENTATION.md', name: 'API Documentation', icon: '📖' },
    { id: 'openapi.yaml', name: 'OpenAPI Specification', icon: '🔧' },
    { id: 'test-api.js', name: 'Testing Utility', icon: '🧪' },
  ];

  useEffect(() => {
    loadDocument(activeDoc);
  }, [activeDoc]);

  const loadDocument = async (filename: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}`);
      }
      const text = await response.text();
      setContent(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (text: string, filename: string) => {
    if (filename.endsWith('.md')) {
      // Basic markdown formatting
      return text
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
        .replace(/\n/g, '<br>');
    }
    return text;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>📚 API Documentation</h1>
        <p>Comprehensive documentation for the Capture Booking Data API</p>
      </header>

      <div className={styles.content}>
        <nav className={styles.sidebar}>
          <h3>Documents</h3>
          <ul>
            {documents.map((doc) => (
              <li key={doc.id}>
                <button
                  className={`${styles.docButton} ${activeDoc === doc.id ? styles.active : ''}`}
                  onClick={() => setActiveDoc(doc.id)}
                >
                  <span className={styles.docIcon}>{doc.icon}</span>
                  {doc.name}
                </button>
              </li>
            ))}
          </ul>
          
          <div className={styles.quickLinks}>
            <h4>Quick Links</h4>
            <Link href="/" className={styles.backLink}>← Back to Home</Link>
            <a href="/api/ask" className={styles.apiLink}>API Endpoint</a>
          </div>
        </nav>

        <main className={styles.main}>
          <div className={styles.toolbar}>
            <h2>{documents.find(d => d.id === activeDoc)?.name}</h2>
            <a
              href={`/${activeDoc}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.downloadButton}
            >
              📄 View Raw
            </a>
          </div>

          <div className={styles.document}>
            {loading && (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading document...</p>
              </div>
            )}

            {error && (
              <div className={styles.error}>
                <p>❌ {error}</p>
                <button onClick={() => loadDocument(activeDoc)}>Retry</button>
              </div>
            )}

            {!loading && !error && (
              <div 
                className={styles.content}
                dangerouslySetInnerHTML={{ 
                  __html: formatContent(content, activeDoc) 
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 