import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    
    // Security: Sanitize project ID
    const sanitizedProjectId = projectId.replace(/[^a-zA-Z0-9_-]/g, '');
    if (sanitizedProjectId !== projectId) {
      return new NextResponse('Invalid project ID', { status: 400 });
    }
    
    const projectDir = path.join(process.cwd(), 'public', 'flutter_apps', sanitizedProjectId);
    const indexPath = path.join(projectDir, 'index.html');
    
    try {
      // Read the HTML file
      const htmlContent = await fs.readFile(indexPath, 'utf8');
      
      // Return the HTML with proper headers
      return new NextResponse(htmlContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Frame-Options': 'SAMEORIGIN',
        },
      });
    } catch (fileError) {
      return new NextResponse('Project not found', { status: 404 });
    }
  } catch (error) {
    console.error('Error serving Flutter preview:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}