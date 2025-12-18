import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(req: Request) {
  try {
    if (!process.env.VERCEL_BLOB_TOKEN) {
      return NextResponse.json({ error: 'Vercel Blob token not configured' }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as any;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileName = file.name || `upload-${Date.now()}`;
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    const result = await put(`blog-images/${Date.now()}-${fileName}`, uint8, {
      access: 'public',
    });

    return NextResponse.json({ url: result.url });
  } catch (err: any) {
    console.error('Upload API error:', err);
    return NextResponse.json({ error: err?.message || 'Upload failed' }, { status: 500 });
  }
}
