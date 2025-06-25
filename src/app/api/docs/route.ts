import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * API route to serve documentation files
 * This allows easy access to documentation files with proper content-type headers
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const file = searchParams.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'File parameter is required' },
        { status: 400 }
      );
    }
    
    // Define allowed documentation files for security
    const allowedFiles = [
      'API_DOCUMENTATION.md',
      'openapi.yaml',
      'test-api.js',
      'README.md',
      'src/types/api.ts'
    ];
    
    if (!allowedFiles.includes(file)) {
      return NextResponse.json(
        { error: 'File not found or not allowed' },
        { status: 404 }
      );
    }
    
    // Get the file path - files are in the project root (same level as src/)
    const filePath = path.join(process.cwd(), file);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: `File not found: ${filePath}` },
        { status: 404 }
      );
    }
    
    // Read file content
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Determine content type based on file extension
    let contentType = 'text/plain';
    if (file.endsWith('.md')) {
      contentType = 'text/markdown';
    } else if (file.endsWith('.yaml') || file.endsWith('.yml')) {
      contentType = 'application/x-yaml';
    } else if (file.endsWith('.js')) {
      contentType = 'application/javascript';
    } else if (file.endsWith('.ts')) {
      contentType = 'application/typescript';
    }
    
    // Return file content with appropriate headers
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
    
  } catch (error) {
    console.error('Error serving documentation file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 