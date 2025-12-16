import { NextRequest, NextResponse } from 'next/server';
import { getFileContent, commitFile } from '@/lib/github';

export async function GET() {
  try {
    // Test reading categories.json
    const content = await getFileContent('content/categories.json');
    return NextResponse.json({ success: true, content });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { testData } = await request.json();
    
    // Test writing to categories.json
    await commitFile('content/categories.json', JSON.stringify(testData, null, 2), 'Test API commit');
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}